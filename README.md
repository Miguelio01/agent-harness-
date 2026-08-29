# Informática y Tributos S.A.S. - Agent Evaluation Harness (Zero Config)

Este repositorio contiene el framework y arnés de pruebas diseñado para automatizar la ingesta de radicaciones tributarias y la generación de código modular cumpliendo con las normas ISO 27001 (Seguridad) e ISO 9001 (Calidad).

## 🚀 Configuración Inicial (Zero Config)

### Requisitos previos:
- Docker y Docker-compose.
- Node.js (v18 o superior).

### Inicializar el entorno:
Este comando levanta la base de datos PostgreSQL local en Docker, ejecuta las tablas iniciales e instala todas las dependencias del proyecto:
```bash
pnpm run setup
```

---

## 🛠️ Ejecución de Flujos

### 1. Ingesta y Parsing de Radicación (Flow A)
Coloque el requerimiento JSON en `requirements/pending/radicado_ejemplo.json`. Ejecute el Harness CLI para validar la estructura, aplicar reglas ISO 27001 y guardar la versión aprobada y sanitizada:
```bash
pnpm run start:harness -- --input=requirements/pending/radicado_ejemplo.json
```

### 2. Ejecutar Control de Calidad (Quality Gate - ISO 9001)
Una vez que el agente de IA (Claude Code, OpenCode o Gemini) genere la lógica de código, ejecuta el Quality Gate para auditar que cumpla con los estándares de linter, estructura y pruebas unitarias:
```bash
pnpm run quality-check
```

---

## 📁 Estructura de Módulos

*   **`apps/angular-app/`:** Aplicación frontend Angular con estándares standalone y Signals.
*   **`apps/nest-app/`:** Backend NestJS configurado con TypeORM y validación de DTOs.
*   **`mcp-servers/`:** Servidor MCP local de sanitización de seguridad (`security-sanitizer.js`).
*   **`requirements/`:** Radicados pendientes (`pending/`) y aprobados (`approved/`).
*   **`.claude/skills/` & `.opencode/rules/`:** Reglas e instrucciones locales para agentes de IA.
