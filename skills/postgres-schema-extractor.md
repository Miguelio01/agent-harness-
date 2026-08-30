# Skill: Extractor de Esquemas Postgres via MCP

Esta habilidad describe cómo los agentes de IA deben utilizar la conexión local de base de datos a través de MCP para consultar, mapear e interactuar con esquemas PostgreSQL.

## 1. Conexión de Base de Datos
El agente debe conectarse al servidor MCP de PostgreSQL declarado en `.mcp.json` bajo el nombre `postgres-db`:
*   **Comando de Configuración:** `npx -y @modelcontextprotocol/server-postgres postgresql://tributos_user:tributos_password@localhost:5432/tributos_db`
*   **Establecer Conexión:** Interactuar con el puerto expuesto del contenedor de Docker local.

## 2. Flujo de Lectura y Mapeo
*   **Inspección del Esquema:** El agente debe listar y describir las tablas del esquema utilizando las herramientas del MCP (e.g., query) para recuperar las columnas, restricciones y tipos de datos de `declaraciones_ica` o cualquier tabla tributaria.
*   **Mapeo de Tipos:** Traducir los tipos de datos de Postgres a tipos de TypeScript de forma rigurosa:
    *   `UUID` / `VARCHAR` -> `string`
    *   `NUMERIC` / `DECIMAL` -> `number`
    *   `TIMESTAMP` -> `Date`
*   **Sincronización:** Asegurar que los campos definidos en las entidades TypeORM (`@Column`) tengan el mismo tipo físico en la base de datos (e.g. `precision`, `scale` para montos numéricos) para evitar fallos de persistencia.
