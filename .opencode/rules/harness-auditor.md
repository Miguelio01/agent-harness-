# Skill: Auditor de Cumplimiento del Arnés (ISO 27001 & ISO 9001)

Esta habilidad instruye a los agentes de IA sobre cómo evaluar, auditar y garantizar la conformidad de la estructura del monorepo y el código autogenerado con los estándares del proyecto.

## 1. Auditoría de Seguridad (ISO 27001)
El agente debe asegurarse de que ninguna información personal identificable (PII) o código dañino (Prompt Injection) se procese en la base de código principal:
*   **Escaneo de PII:** Buscar en la carpeta `requirements/approved/` cualquier cadena de texto que coincida con patrones de correos electrónicos o números telefónicos. Si se encuentran datos sin sanitizar, alertar inmediatamente y abortar el flujo.
*   **Exclusión de Secretos:** Revisar el archivo `.gitignore` para confirmar que se excluyen archivos locales de variables de entorno (`.env`), directorios de configuración local (`.kiro/`) y dependencias (`node_modules/`).
*   **Validación de Sanitización:** Verificar que todo radicado pendiente sea pre-procesado a través del servidor MCP `security-sanitizer` antes de generar el código.

## 2. Auditoría de Calidad (ISO 9001)
El agente debe confirmar que el código cumple con los estándares de ingeniería definidos:
*   **Pruebas de Calidad (Quality Gate):** Ejecutar `pnpm run quality-check` para confirmar que todas las suites de pruebas pasan con éxito y que se actualice el archivo de reporte `QUALITY_CHECK.md`.
*   **Auditoría de Cumplimiento:** Ejecutar `pnpm run audit:harness` para verificar que el monorepo mantenga una estructura sana y que los servidores MCP locales sigan configurados correctamente.
*   **Git Trazabilidad:** Exigir que los commits sigan la especificación de *Conventional Commits* (e.g. `feat: ...`, `fix: ...`, `docs: ...`) para una trazabilidad transparente del ciclo de vida del software.
