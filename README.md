# Deployment Config Generator

Mini fullstack app generate deployment config as JSON, `docker-compose.yml`, or Docker Swarm compose.

## Tech stack

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- React Hook Form
- MUI theme

### Backend

- NestJS
- TypeScript
- class-validator
- js-yaml
- Jest

## Project structure

```txt
deployment-config-generator/
├── docs/
├── frontend/
└── backend/
```

## Run backend

```bash
cd backend
npm install
npm run start:dev
```

Backend runs at `http://localhost:3001`.

## Run frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`.

## API example

```bash
curl -X POST http://localhost:3001/deploy-config/generate \
  -H "Content-Type: application/json" \
  -d '{
    "appName":"cindy-backend",
    "runtime":"node",
    "image":"cindy-backend:latest",
    "port":3000,
    "replicas":3,
    "healthCheck":"/health",
    "env":[
      {"key":"NODE_ENV","value":"production"},
      {"key":"DATABASE_URL","value":"postgresql://user:pass@postgres:5432/app"}
    ],
    "services":{"redis":true,"postgres":true,"worker":true,"haproxy":false},
    "outputType":"docker-compose"
  }'
```

## Builder Pattern short

Backend uses Builder Pattern because deployment config has many optional parts: app service, env variables, Redis, Postgres, Worker, HAProxy, replicas, health check, networks, and volumes.

Controller only receives request. Service coordinates. Builder creates config object. Formatter converts object to JSON or YAML.

## Docs

- [Architecture](docs/architecture.md)
- [Builder Pattern](docs/builder-pattern.md)
- [API](docs/api.md)
- [Frontend](docs/frontend.md)
- [Backend](docs/backend.md)

## Screenshots

Placeholder:

```txt
[ Screenshot: form + config preview ]
```
