# Informática y Tributos S.A.S. - Agent Evaluation Harness (Zero Config)

Este repositorio contiene el framework y arnés de pruebas diseñado para automatizar la ingesta de radicaciones tributarias y la generación de código modular cumpliendo con las normas **ISO 27001 (Seguridad)** e **ISO 9001 (Calidad)**.

---

## 🚀 Configuración Inicial (Zero Config)

### Requisitos previos:
- **Docker** y **Docker-compose** (para la base de datos PostgreSQL local).
- **Node.js** (v18 o superior, recomendado v20/v22).
- **pnpm** (v10 o superior, gestor de paquetes del monorepo).

### Versiones de Stack Tecnológico Alinhadas:
*   **Backend:** NestJS `v10.x` en Node ESM.
*   **Frontend:** Angular Standalone `v17.3.x` con Signals y Reactive Forms.
*   **TypeScript:** `v5.4.5` (alineada para compatibilidad estricta del compilador Angular 17).
*   **Base de Datos:** PostgreSQL `v15` en Docker.

### Inicializar el entorno (Auto-Registro Global):
Este comando automatiza el setup completo del workspace:
1. Levanta el contenedor Docker `tributos-db` y ejecuta los scripts SQL de inicialización.
2. Instala todas las dependencias del monorepo con `pnpm`.
3. **Protocolo de Auto-Registro Global (Zero-Config):** Ejecuta `scripts/auto-register.mjs` para registrar automáticamente nuestros 2 servidores MCP (`security-sanitizer` y `postgres-db`) y copiar las habilidades/prompts locales a los directorios de configuración de tus CLIs de IA:
   - **Claude Code / Claude Desktop:** Registra los MCPs agregándolos a `~/.claude.json` y `~/.config/claude/config.json`.
   - **Gemini / Antigravity CLI:** Copia las habilidades locales al repositorio de conocimiento global (`~/.gemini/skills/`).
   - **Kiro CLI:** Importa la configuración al workspace local (`kiro-cli mcp import`).
   - **Cursor IDE / Codex:** Crea automáticamente `.cursorrules` en la raíz del proyecto unificando las reglas locales.
   - **OpenCode Interpreter:** Copia y estructura las directrices locales en `.opencode/rules/`.

```bash
pnpm run setup
```

---

## 🛠️ Ejecución de Flujos

### 1. Ingesta y Parsing de Radicación (Flow A)
Coloque el requerimiento JSON en `requirements/pending/radicado_ejemplo.json`. Ejecute el Harness CLI para validar la estructura, aplicar la sanitización de seguridad (ISO 27001) y guardar la versión aprobada:
```bash
pnpm run start:harness -- --input=requirements/pending/radicado_ejemplo.json
```

### 2. Ejecución de Servidores en Desarrollo

*   **Backend (NestJS + TypeORM):**
    Compila en tiempo real usando `tsc` y levanta en el puerto `3000`:
    ```bash
    pnpm --filter nest-app start
    ```
    *GET/POST endpoint disponible en: `http://localhost:3000/declaraciones-ica`*

*   **Frontend (Angular Standalone + Signals):**
    Levanta el servidor Webpack de desarrollo en el puerto `4200` cargando los polyfills de `zone.js`:
    ```bash
    pnpm --filter angular-app start
    ```
    *Acceso web en: `http://localhost:4200/`*

### 3. Ejecutar Control de Calidad (Quality Gate - ISO 9001)
Audita la validez del código generado, asegurando el cumplimiento de la estructura física del monorepo, convenciones de nombrado y ejecutando las suites de pruebas unitarias en backend y frontend (Vitest + JSDOM):
```bash
pnpm run quality-check
```
*Reporte consolidado en `QUALITY_CHECK.md`.*

---

## 🛡️ Model Context Protocol (MCP) y Seguridad (ISO 27001)

El arnés incorpora la arquitectura de **Model Context Protocol (MCP)** para extender y regular las capacidades de los agentes de IA de forma controlada y segura:

### 1. Servidores MCP Incluidos:
*   **`security-sanitizer` (`mcp-servers/security-sanitizer.js`):**
    Servidor MCP local personalizado que actúa como firewall de entrada. Implementa la herramienta `sanitize_payload` que detecta PII (correos, números de teléfono) e inyecciones de código en descripciones libres de trámites, reemplazándolos con tokens redactados antes de que la IA lea el requerimiento.
*   **`postgres-db` (PostgreSQL Model Context Protocol Server):**
    Permite al agente inspeccionar esquemas de tablas existentes en tiempo real.
    > [!IMPORTANT]
    > **Principio de Mínimo Privilegio (ISO 27001):** Por diseño, el canal del agente de IA está configurado en transacciones de solo lectura (`read-only transaction`). El agente no puede modificar datos directamente por SQL (INSERT/DELETE), obligando a canalizar todas las escrituras a través de las APIs controladas de la aplicación (NestJS).

### 2. Archivo de Configuración Global (`.mcp.json`):
Contiene la declaración y argumentos de arranque de los servidores MCP para integrarse en herramientas de desarrollo compatibles como **Kiro CLI**, **Claude Code** y **OpenCode / Antigravity**.

---

## 📁 Estructura del Monorepo

*   **`apps/angular-app/`:** Frontend Angular Standalone con Signals para caching del estado, servicios HTTP reactivos y formularios con validadores.
*   **`apps/nest-app/`:** Backend NestJS en ESM con entidades TypeORM persistiendo en PostgreSQL y DTOs de validación estricta (`class-validator`).
*   **`mcp-servers/`:** Servidor MCP local de seguridad escrito en JavaScript modular compatible con el SDK de Model Context Protocol.
*   **`skills/`:** Repositorio de habilidades/prompts en Markdown para guiar a los agentes de IA en la generación de código corporativo estándar.
*   **`requirements/`:** Radicados pendientes (`pending/`) y aprobados sanitizados (`approved/`).
*   **`scripts/`:** Scripts de automatización (`setup.sh`, `quality-check.js`, `audit-harness.js`).
*   **`.claude/skills/`:** Habilidades JSON integrables directamente en Claude Code.
