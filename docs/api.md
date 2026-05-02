# API

## POST /deploy-config/generate

Generate deployment config from form input.

### Request

```json
{
  "appName": "cindy-backend",
  "runtime": "node",
  "image": "cindy-backend:latest",
  "port": 3000,
  "replicas": 3,
  "healthCheck": "/health",
  "env": [
    { "key": "NODE_ENV", "value": "production" },
    { "key": "DATABASE_URL", "value": "postgresql://user:pass@postgres:5432/app" }
  ],
  "services": {
    "redis": true,
    "postgres": true,
    "worker": true,
    "haproxy": false
  },
  "outputType": "docker-compose"
}
```

### Response

```json
{
  "success": true,
  "outputType": "docker-compose",
  "fileName": "docker-compose.yml",
  "config": "version: '3.9'\nservices:\n..."
}
```

### cURL

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
    "env":[{"key":"NODE_ENV","value":"production"}],
    "services":{"redis":true,"postgres":true,"worker":true,"haproxy":false},
    "outputType":"docker-compose"
  }'
```
