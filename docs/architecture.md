# Architecture

## Flow

```txt
User
→ Next.js form
→ POST /deploy-config/generate
→ NestJS controller
→ DTO validation
→ DeployConfigService
→ DeployConfigDirector
→ DeployConfigBuilder / DockerComposeBuilder / SwarmComposeBuilder
→ JsonConfigFormatter / YamlConfigFormatter
→ Response config string
→ Preview + copy + download
```

## Frontend responsibilities

- Render deploy configuration form.
- Validate basic required fields before submit.
- Call backend API.
- Display backend validation errors.
- Preview returned config.
- Copy config to clipboard.
- Download generated file.

## Backend responsibilities

- Expose `POST /deploy-config/generate`.
- Validate request body with DTO and `class-validator`.
- Keep controller thin.
- Coordinate builder and formatter in service.
- Return file name and config content.

## Builder responsibilities

- Build deployment config object step by step.
- Add app service.
- Add environment variables.
- Add optional Redis, Postgres, Worker, HAProxy.
- Add replicas and health check.
- Validate minimum build state in `build()`.

## Formatter responsibilities

- Convert config object to string output.
- JSON formatter handles pretty JSON.
- YAML formatter uses `js-yaml` for compose output.
