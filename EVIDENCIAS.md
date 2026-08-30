# EVIDENCIAS.md - Registro de Ejecución y Validaciones

Este archivo contiene la bitácora paso a paso del funcionamiento del arnés con el radicado de prueba suministrado.

---

## 1. Logs de Ingesta y Sanitización (ISO 27001)
Ejecutando el Harness con un archivo que incluye datos sensibles (correos y teléfonos de contacto en la descripción):

```bash
$ pnpm run start:harness -- --input=requirements/pending/radicado_ejemplo.json

=== Ingesta e ISO 27001 ===
Radicado RAD-2026-8842 cargado correctamente. Iniciando desensibilización ISO 27001...
[OK] Radicado sanitizado guardado con éxito en: requirements/approved/DeclaracionRetencionIca-approved.json
```

### Comparación de Datos Sensibles:
*   **Input Original (`descripcion`):**
    > "...para contribuyentes. Contactar al supervisor en supervisor@tributos.com o al +573001234567 para autorizar."
*   **Output Sanitizado (`descripcion`):**
    > "...para contribuyentes. Contactar al supervisor en [EMAIL_REDACTED] o al +[PHONE_REDACTED] para autorizar."

---

## 2. Estructura de Código Generado (NestJS / Angular)
Tras procesar el radicado, el agente genera la estructura de la aplicación.

### Backend (NestJS Entity):
`apps/nest-app/src/modules/declaracion-retencion-ica/declaracion-retencion-ica.entity.ts`:
```typescript
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('declaraciones_ica')
export class DeclaracionRetencionIca {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'nit_contribuyente', type: 'varchar', length: 20 })
  nitContribuyente: string;

  @Column({ name: 'periodo_grabable', type: 'varchar', length: 6 })
  periodoGrabable: string;

  @Column({ name: 'monto_retenido', type: 'numeric', precision: 15, scale: 2 })
  montoRetenido: number;

  @Column({ type: 'varchar', length: 15, default: 'PENDIENTE' })
  estado: string;
}
```

### Frontend (Angular Signals & Standalone):
`apps/angular-app/src/app/declaraciones-ica/formulario-radicacion.component.ts`:
```typescript
import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DeclaracionesIcaService } from './declaraciones-ica.service';

@Component({
  selector: 'app-formulario-radicacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="form-container">
      <h3>Radicación de Declaración</h3>
      <form [formGroup]="radicacionForm" (ngSubmit)="onSubmit()">
        ...
      </form>
    </div>
  `
})
export class FormularioRadicacionComponent {
  estadoGeneral = signal('LISTO');
  radicacionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: DeclaracionesIcaService
  ) {
    this.radicacionForm = this.fb.group({
      nitContribuyente: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      periodoGrabable: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      montoRetenido: [0, [Validators.required, Validators.min(0.01)]]
    });
  }
}
```

---

## 3. Log de Quality Gate (ISO 9001)
Ejecución del pipeline de verificación de linter, arquitectura y pruebas automáticas:

```bash
$ pnpm run quality-check

> agent-harness-workspace@1.0.0 quality-check /Users/miguelio/Documents/GitHub/agent-harness-
> node scripts/quality-check.js

=== Quality Gate: Running Audits (ISO 9001) ===
Running unit tests via pnpm...
Scope: 2 of 3 workspace projects
apps/angular-app test$ vitest run
apps/nest-app test$ vitest run
apps/nest-app test: The CJS build of Vite's Node API is deprecated. See https://vite.dev/guide/troubleshooting.html#vite-cjs-node-api-deprecated for more details.
apps/nest-app test:  RUN  v1.6.1 /Users/miguelio/Documents/GitHub/agent-harness-/apps/nest-app
apps/angular-app test:  RUN  v1.6.1 /Users/miguelio/Documents/GitHub/agent-harness-/apps/angular-app
apps/angular-app test:  ✓ src/app/declaraciones-ica/tabla-consulta.component.spec.ts  (1 test) 2ms
apps/angular-app test:  ✓ src/app/declaraciones-ica/formulario-radicacion.component.spec.ts  (2 tests) 7ms
apps/angular-app test:  Test Files  2 passed (2)
apps/angular-app test:       Tests  3 passed (3)
apps/angular-app test:    Start at  11:03:07
apps/angular-app test:    Duration  1.24s (transform 82ms, setup 0ms, collect 933ms, tests 9ms, environment 823ms, prepare 161ms)
apps/nest-app test:  ✓ src/modules/declaracion-retencion-ica/declaracion-retencion-ica.controller.spec.ts  (2 tests) 5ms
apps/nest-app test:  Test Files  1 passed (1)
apps/nest-app test:       Tests  2 passed (2)
apps/nest-app test:    Start at  11:03:06
apps/nest-app test:    Duration  1.66s (transform 165ms, setup 0ms, collect 1.30s, tests 5ms, environment 0ms, prepare 98ms)
apps/angular-app test: Done
apps/nest-app test: Done
[OK] Quality Gate execution finished. Report written to QUALITY_CHECK.md
```

---

## 4. Pruebas del Protocolo MCP (Model Context Protocol)

### Prueba A: Verificación de Protocolo JSON-RPC stdio (Fidelidad con Antigravity / Claude Code)
Para demostrar el correcto funcionamiento del servidor MCP sobre la especificación estándar de comunicación JSON-RPC stdio, ejecutamos una secuencia de peticiones crudas a la entrada estándar (`stdin`) del script:

```bash
$ node scratch/test-mcp-jsonrpc.js
Starting local MCP server at: /Users/miguelio/Documents/GitHub/agent-harness-/mcp-servers/security-sanitizer.js
--- Sending initialize request ---
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2024-11-05",
    "capabilities": {},
    "clientInfo": {
      "name": "antigravity-test-client",
      "version": "1.0.0"
    }
  }
}

--- Received JSON-RPC Response ---
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "protocolVersion": "2024-11-05",
    "capabilities": {
      "tools": {}
    },
    "serverInfo": {
      "name": "security-sanitizer",
      "version": "1.0.0"
    }
  }
}

--- Sending tools/call request ---
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "sanitize_payload",
    "arguments": {
      "payload": "Hola, mi nit es 123 y mi correo es supervisor@tributos.com, telefono +573001234567."
    }
  }
}

--- Received JSON-RPC Response ---
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\"success\":true,\"data\":\"Hola, mi nit es 123 y mi correo es [EMAIL_REDACTED], telefono +[PHONE_REDACTED].\"}"
      }
    ]
  }
}

SUCCESS: MCP tool sanitize_payload executed successfully over stdio!
```

---

## 5. Pruebas Transaccionales y Flujo Completo con LLM
Se ejecutó un escenario real donde un agente de IA interactúa de forma secuencial con ambos servidores MCP (`security-sanitizer` y `postgres-db`) para analizar un requerimiento libre, sanitizarlo, extraer los valores e interactuar con la base de datos.

### Bitácora de Llamados de la IA en Kiro CLI:
1.  **Sanitización de Datos de Entrada:**
    *   **Petición cruda:** `"Estimados, favor radicar la declaración de retención de ICA para el contribuyente con NIT 830.092.110-3 correspondiente al periodo de julio de 2026 (202607) por un valor de $8450300.00... escribir a miguel.beltran@tributos.com."`
    *   **Acción del MCP `security-sanitizer`:** Enmascaró `miguel.beltran@tributos.com` $\rightarrow$ `[EMAIL_REDACTED]` y el teléfono en `0.9s`.
2.  **Extracción e Intento de Inserción Directa:**
    El agente extrajo los datos e intentó insertarlos directamente por SQL en la base de datos usando `postgres-db`:
    ```sql
    INSERT INTO declaraciones_ica (nit_contribuyente, periodo_grabable, monto_retenido, estado) VALUES (...);
    ```
    *   **Acción de Seguridad (ISO 27001):** El servidor MCP `postgres-db` bloqueó la transacción levantando el error: `cannot execute INSERT in a read-only transaction` (Protección contra inyección directa y corrupción de datos).
3.  **Inserción Exitosa vía API de Aplicación (NestJS):**
    Para cumplir con el diseño, el registro fue inyectado de forma segura a través del endpoint REST del Backend de NestJS:
    ```bash
    curl -X POST -H "Content-Type: application/json" -d '{"nitContribuyente":"830092110-3","periodoGrabable":"202607","montoRetenido":8450300.00}' http://localhost:3000/declaraciones-ica
    ```
    *   **Respuesta del Backend (201 Created):**
        `{"id":"d60c42ca-5c75-4093-9cd1-d29c03fd3c1d","nitContribuyente":"830092110-3","periodoGrabable":"202607","montoRetenido":8450300,"estado":"PENDIENTE"}`
