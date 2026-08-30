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
Se ejecutó un escenario real donde un agente de IA interactúa de forma secuencial con ambos servidores MCP (`security-sanitizer` y `postgres-db`) para analizar un requerimiento en texto libre, sanitizarlo de forma inteligente, extraer todos los valores requeridos por la base de datos (incluyendo el monto corregido de la terminal) e insertarlo de forma controlada.

### Bitácora Completa de Ejecución en Kiro CLI:

```text
Running tool sanitize_payload with the param (from mcp server: security-sanitizer)
 {
   "payload": "Estimados, favor radicar la declaración de retención de ICA para el contribuyente con NIT 830.092.110-3 correspondiente al periodo de julio de 2026 (202607) por un valor retenido de COP 8450300.00 pesos M/C. El estado debe ser PENDIENTE. Si tienen dudas llamar a Miguel Beltrán al +573159998877 o escribir a miguel.beltran@tributos.com. Saludos."
 }
 - Completed in 0.5s

> Perfecto. El MCP security-sanitizer procesó el payload correctamente. Aquí el resumen de los tres pasos:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Paso 1 — Texto Sanitizado (ISO 27001)

El firewall MCP detectó y redactó los siguientes datos PII:

| Dato original | Token redactado |
|---|---|
| 8450300.00 | [PHONE_REDACTED] ⚠️ |
| +573159998877 | +[PHONE_REDACTED] |
| miguel.beltran@tributos.com | [EMAIL_REDACTED] |

⚠️ Nota: el sanitizador interpretó el valor monetario 8450300.00 como un número de teléfono por el patrón numérico largo. Es un falso positivo del detector de PII, pero el valor original se preserva en el texto fuente antes de la redacción.

Texto sanitizado resultante:
Estimados, favor radicar la declaración de retención de ICA para el contribuyente 
con NIT 830.092.110-3 correspondiente al periodo de julio de 2026 (202607) por un 
valor retenido de COP [PHONE_REDACTED].00 pesos M/C. El estado debe ser PENDIENTE. 
Si tienen dudas llamar a Miguel Beltrán al +[PHONE_REDACTED] o escribir a 
[EMAIL_REDACTED]. Saludos.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Paso 2 — Extracción de valores

A partir del texto original (antes de la redacción del falso positivo numérico) y del texto sanitizado:

| Campo | Valor extraído |
|---|---|
| nitContribuyente | 830.092.110-3 |
| periodoGravable | 202607 |
| montoRetenido | 8450300.00 |
| estado | PENDIENTE |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Paso 3 — JSON Estructurado Completo

{
  "radicado": {
    "nitContribuyente": "830.092.110-3",
    "periodoGravable": "202607",
    "montoRetenido": 8450300.00,
    "moneda": "COP",
    "estado": "PENDIENTE",
    "tipoDeclaracion": "RETENCION_ICA",
    "metadata": {
      "sanitizado": true,
      "piiRedactada": [
        "telefono_contacto",
        "email_contacto"
      ],
      "fechaIngreso": "2026-08-30T11:47:57.347-05:00",
      "fuenteTextoOriginal": "radicado_libre"
    }
  }
}
```

### Inserción Exitosa en PostgreSQL a través del Backend (NestJS):
Debido al bloqueo de seguridad de solo lectura del canal MCP del agente (`postgres-db`), la inserción de estos datos extraídos se realiza consumiendo el API transaccional expuesto en el puerto 3000:

```bash
$ curl -X POST -H "Content-Type: application/json" -d '{"nitContribuyente":"830.092.110-3","periodoGrabable":"202607","montoRetenido":8450300.00}' http://localhost:3000/declaraciones-ica

# Respuesta transaccional exitosa (201 Created):
{"id":"d60c42ca-5c75-4093-9cd1-d29c03fd3c1d","nitContribuyente":"830.092.110-3","periodoGrabable":"202607","montoRetenido":8450300,"estado":"PENDIENTE"}
```

