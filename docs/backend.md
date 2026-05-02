# Backend

## Stack

- NestJS
- TypeScript
- class-validator
- js-yaml
- Jest

## Main modules

- `DeployConfigController`: receives HTTP request only.
- `DeployConfigService`: coordinates builder and formatter.
- `DeployConfigDirector`: applies build steps in correct order.
- `DeployConfigBuilder`: chain API that creates config object.
- `JsonConfigFormatter`: converts object to JSON string.
- `YamlConfigFormatter`: converts object to YAML string.

## Builder chain

```ts
new DeployConfigBuilder()
  .setBaseVersion('3.9')
  .addAppService({ appName, image, port })
  .addEnvironment(appName, env)
  .setReplicas(appName, replicas)
  .addHealthCheck(appName, healthCheck, port)
  .enableRedis()
  .enablePostgres()
  .enableWorker(image)
  .enableHAProxy()
  .build();
```

## Run

```bash
cd backend
npm install
npm run start:dev
```

API runs on `http://localhost:3001`.

## Test

```bash
npm test
```
