# CLAUDE.md - Rules and Flows for Claude Code

## Run Scripts
- Install and configure environment: `pnpm run setup`
- Ingest requirement (Flow A): `pnpm run start:harness -- --input=requirements/pending/radicado.json`
- Quality Check (Flow B Validation): `pnpm run quality-check`

## Project Context
This is an evaluation harness for Informática y Tributos S.A.S. containing Angular (Signals, Standalone) and NestJS (TypeORM, validation DTOs) workspaces with a Postgres database.

## Architecture Standards
When implementing generated files based on approved json under `requirements/approved/`:

### 1. Back-End (NestJS)
- Modules must reside under `apps/nest-app/src/modules/[tramite]/`.
- Entities must be decorated with TypeORM mapping to Postgres table names defined in the JSON.
- DTOs must use validation decorators from `class-validator` (e.g. `@IsNotEmpty()`, `@IsNumber()`).
- Controller must define RESTful routes (GET/POST) and handle exceptions.

### 2. Front-End (Angular)
- Components must be standalone: `standalone: true`.
- Forms must use Angular `ReactiveFormsModule` with validators derived from business rules.
- State: use Angular Signals (`signal`, `computed`).
- HTTP Service: create in `apps/angular-app/src/app/services/[tramite].service.ts`.
