# Skill: Generador de Trámites Tributarios (NestJS + Angular)

Esta habilidad guía a los agentes de IA en el desarrollo y autogeneración de la lógica funcional para trámites tributarios del monorepo, alineándose con las directivas de arquitectura del proyecto.

## 1. Entrada de Datos
El agente debe leer e interpretar el radicado tributario aprobado ubicado en `requirements/approved/[radicado]-approved.json`. Este archivo contiene:
*   NIT y detalles del contribuyente.
*   Periodo gravable y montos.
*   Especificación de campos requeridos para la base de datos PostgreSQL.

## 2. Generación del Back-End (NestJS)
Al crear módulos bajo `apps/nest-app/src/modules/`, el agente debe seguir este estándar:
*   **Entidad TypeORM:** Nombrar la clase terminando en `Entity` y mapearla mediante `@Entity('nombre_tabla')` según la definición del JSON. Declarar claves primarias UUID, tipos de datos compatibles con Postgres (`varchar`, `numeric`, `timestamp`) y restricciones `CHECK`.
*   **DTO de Entrada:** Nombrar la clase terminando en `Dto`. Emplear decoradores de `class-validator` (e.g., `@IsNotEmpty()`, `@IsString()`, `@Matches()`, `@IsNumber()`, `@Min()`) para validar estrictamente campos sensibles (e.g., formato de periodos `YYYYMM` o NITs).
*   **Servicio:** Manejar persistencia, inserción y consultas básicas usando `@InjectRepository`.
*   **Controlador:** Exponer rutas REST (`POST` para creación, `GET` para consulta). Injectar el servicio y gestionar excepciones.
*   **Pruebas Unitarias:** Crear archivos `.spec.ts` para validar el ruteo del controlador y el guardado de datos usando mocks para el servicio.

## 3. Generación del Front-End (Angular)
Al crear componentes standalone bajo `apps/angular-app/src/app/`, el agente debe seguir este estándar:
*   **Standalone Components:** Configurar `standalone: true` e importar módulos mínimos (`CommonModule`, `ReactiveFormsModule`).
*   **Signals de Estado:** Manejar el estado reactivo del componente utilizando Angular Signals (`signal`, `computed`). Evitar variables de instancia estándar mutables directamente.
*   **Formularios Reactivos:** Implementar `FormBuilder` y `FormGroup` vinculando validadores que coincidan con las restricciones de negocio del Backend.
*   **Servicios HTTP:** Consumir los endpoints de NestJS mediante llamadas HTTP reactivas de RxJS mapeadas a promesas de Fetch o HttpClient.
*   **Pruebas Unitarias:** Crear archivos `.spec.ts` importando `@angular/compiler` en la primera línea para resolver inyecciones de contexto y testear validaciones del formulario y llamadas al servicio.
