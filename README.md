# Informatica y Tributos S.A.S. - Agent Evaluation Harness (Zero Config)

Este repositorio contiene el framework y arnes de pruebas disenado para automatizar la ingesta de radicaciones tributarias y la generacion de codigo modular cumpliendo con las normas ISO 27001 (Seguridad) e ISO 9001 (Calidad).

---

## Configuracion Inicial (Zero Config)

### Requisitos previos:
- Docker y Docker-compose (para la base de datos PostgreSQL local).
- Node.js (v18 o superior, recomendado v20/v22).
- pnpm (v10 o superior, gestor de paquetes del monorepo).

### Versiones de Stack Tecnologico Alineadas:
- Backend: NestJS v10.x en Node ESM.
- Frontend: Angular Standalone v17.3.x con Signals y Reactive Forms.
- TypeScript: v5.4.5 (alineada para la compatibilidad del compilador Angular 17).
- Base de Datos: PostgreSQL v15 en Docker.

### Inicializar el entorno (Auto-Registro Global):
Este comando automatiza el setup completo del workspace:
1. Levanta el contenedor Docker tributos-db y ejecuta los scripts SQL de inicializacion.
2. Instala todas las dependencias del monorepo con pnpm.
3. **Protocolo de Auto-Registro Global (Zero-Config):** Ejecuta scripts/auto-register.mjs para registrar automaticamente los servidores MCP (security-sanitizer y postgres-db) y copiar las habilidades/prompts locales a los directorios de configuracion de los CLIs de IA:
   - Claude Code / Claude Desktop: Registra los MCPs agregandolos a ~/.claude.json y ~/.config/claude/config.json.
   - Gemini / Antigravity CLI: Copia las habilidades locales al repositorio de conocimiento global (~/.gemini/skills/).
   - Kiro CLI: Importa la configuracion al workspace local (kiro-cli mcp import).
   - Cursor IDE / Codex: Crea automaticamente .cursorrules en la raiz del proyecto unificando las reglas locales.
   - OpenCode Interpreter: Copia y estructura las directrices locales en .opencode/rules/.

```bash
pnpm run setup
```

---

## Ejecucion de Flujos

### 1. Ingesta y Parsing de Radicacion (Flow A)
Coloque el requerimiento JSON en requirements/pending/radicado_ejemplo.json. Ejecute el Harness CLI para validar la estructura, aplicar la sanitizacion de seguridad (ISO 27001) y guardar la version aprobada:
```bash
pnpm run start:harness -- --input=requirements/pending/radicado_ejemplo.json
```

### 2. Ejecucion de Servidores en Desarrollo

- **Backend (NestJS + TypeORM):**
  Compila en tiempo real usando tsc y levanta en el puerto 3000:
  ```bash
  pnpm --filter nest-app start
  ```
  GET/POST endpoint disponible en: http://localhost:3000/declaraciones-ica

- **Frontend (Angular Standalone + Signals):**
  Levanta el servidor Webpack de desarrollo en el puerto 4200 cargando los polyfills de zone.js:
  ```bash
  pnpm --filter angular-app start
  ```
  Acceso web en: http://localhost:4200/

### 3. Ejecutar Control de Calidad (Quality Gate - ISO 9001)
Audita la validez del codigo generado, asegurando el cumplimiento de la estructura fisica del monorepo, convenciones de nombrado y ejecutando las pruebas unitarias en backend y frontend (Vitest + JSDOM):
```bash
pnpm run quality-check
```
Reporte consolidado en QUALITY_CHECK.md.

---

## Model Context Protocol (MCP) y Seguridad (ISO 27001)

El arnes incorpora la arquitectura de Model Context Protocol (MCP) para extender y regular las capacidades de los agentes de IA de forma controlada y segura:

### 1. Servidores MCP Incluidos:
- **security-sanitizer (mcp-servers/security-sanitizer.js):**
  Servidor MCP local personalizado que actua como firewall de entrada. Implementa la herramienta sanitize_payload que detecta PII (correos, numeros de telefono) e inyecciones de codigo en descripciones libres de tramites, reemplazandolos con tokens redactados antes de que la IA lea el requerimiento.
- **postgres-db (PostgreSQL Model Context Protocol Server):**
  Permite al agente inspeccionar esquemas de tablas existentes en tiempo real.
  *Principio de Minimo Privilegio (ISO 27001):* Por diseno, el canal del agente de IA esta configurado en transacciones de solo lectura (read-only transaction). El agente no puede modificar datos directamente por SQL (INSERT/DELETE), obligando a canalizar todas las escrituras a traves de las APIs controladas de la aplicacion (NestJS).

### 2. Archivo de Configuracion Global (.mcp.json):
Contiene la declaracion y argumentos de arranque de los servidores MCP para integrarse en herramientas de desarrollo compatibles como Kiro CLI, Claude Code y OpenCode / Antigravity.

---

## Estructura de Directorios del Monorepo

A continuacion se presenta la distribucion fisica y organizacion de los componentes del proyecto:

```text
.
├── AGENTS.md
├── CLAUDE.md
├── EVIDENCIAS.md
├── HARNESS_DESIGN.md
├── QUALITY_CHECK.md
├── README.md
├── apps
│   ├── angular-app
│   │   ├── angular.json
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── app
│   │   │   │   └── declaraciones-ica
│   │   │   │       ├── declaraciones-ica.service.ts
│   │   │   │       ├── formulario-radicacion.component.ts
│   │   │   │       └── tabla-consulta.component.ts
│   │   │   ├── index.html
│   │   │   └── main.ts
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   └── nest-app
│       ├── package.json
│       ├── src
│       │   ├── main.ts
│       │   └── modules
│       │       └── declaracion-retencion-ica
│       │           ├── declaracion-retencion-ica.controller.ts
│       │           ├── declaracion-retencion-ica.dto.ts
│       │           ├── declaracion-retencion-ica.entity.ts
│       │           ├── declaracion-retencion-ica.module.ts
│       │           └── declaracion-retencion-ica.service.ts
│       └── tsconfig.json
├── db
│   └── postgres
│       └── init.sql
├── docker-compose.yml
├── mcp-servers
│   └── security-sanitizer.js
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── requirements
│   ├── approved
│   └── pending
├── scripts
│   ├── audit-harness.js
│   ├── auto-register.mjs
│   ├── quality-check.js
│   └── setup.sh
└── skills
    ├── generate-tributo.md
    ├── harness-auditor.md
    ├── postgres-schema-extractor.md
    └── security-sanitizer-invoker.md
```
