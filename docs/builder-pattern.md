# Builder Pattern trong Deployment Config Generator

## 1. Builder Pattern là gì?

Builder Pattern là design pattern dùng để tạo object phức tạp theo từng bước. Thay vì truyền nhiều tham số vào constructor hoặc viết nhiều logic if/else rải rác, ta gom quá trình tạo object vào một builder riêng.

Trong hệ thống này, object phức tạp là deployment config.

Ví dụ config có thể gồm:
- app service
- environment variables
- Redis
- Postgres
- Worker
- HAProxy
- replicas
- health check
- networks
- volumes

Nếu build trực tiếp trong service, code sẽ nhanh chóng rối.

## 2. Vì sao dùng Builder Pattern?

Deployment config có nhiều option bật/tắt.

Ví dụ:
- Có app chỉ cần Node service
- Có app cần thêm Redis
- Có app cần thêm Postgres
- Có app cần worker
- Có app cần HAProxy
- Có app cần Docker Swarm replicas

Builder giúp tạo config theo từng bước:

```ts
const config = new DeployConfigBuilder()
  .addAppService(dto)
  .addEnvironment(dto.env)
  .enableRedis()
  .enablePostgres()
  .setReplicas(dto.replicas)
  .build();
```

## 3. Flow trong hệ thống

Frontend gửi form config
→ Backend controller nhận request
→ DTO validate dữ liệu
→ Service gọi Builder
→ Builder tạo config object
→ Formatter convert thành JSON hoặc YAML
→ Backend trả result
→ Frontend preview/copy/download

## 4. Ưu điểm trong dự án này

### 4.1 Controller và Service gọn hơn

Trong dự án này, controller chỉ nhận request và gọi service. Logic tạo config không nằm trong `DeployConfigController`.

Service cũng không tự build từng field YAML. Service chỉ chọn builder, gọi director, chọn formatter rồi trả response.

Luồng chính rõ hơn:

```ts
const config = this.director.build(dto, builder);
const formatter = dto.outputType === 'json' ? this.jsonFormatter : this.yamlFormatter;
```

Điều này giúp code dễ đọc vì mỗi class có một nhiệm vụ:

- Controller: nhận HTTP request
- DTO: validate input
- Service: điều phối
- Director: quyết định thứ tự build
- Builder: tạo object config
- Formatter: convert JSON/YAML

### 4.2 Code dễ đọc

Thay vì:

```ts
if (dto.redis) {
  config.services.redis = ...
}

if (dto.postgres) {
  config.services.postgres = ...
}
```

Ta có:

```ts
builder.enableRedis();
builder.enablePostgres();
```

Code đọc giống business flow.

### 4.3 Dễ mở rộng optional services

Hiện tại project có các option:

- Redis
- Postgres
- Worker
- HAProxy

Mỗi option tương ứng một method trong builder:

```ts
builder.enableRedis();
builder.enablePostgres();
builder.enableWorker(dto.image);
builder.enableHAProxy();
```

Khi thêm service mới như n8n, minio, rabbitmq, prometheus, ta có thể thêm method mới:

```ts
enableN8N()
enableMinio()
enablePrometheus()
```

Không cần sửa quá nhiều logic cũ.

### 4.4 Tránh constructor quá dài

Nếu không dùng Builder, có thể phải truyền rất nhiều tham số:

```ts
new DeployConfig(appName, image, port, env, redis, postgres, worker, haproxy, replicas, healthCheck)
```

Constructor dài như vậy khó đọc và dễ sai thứ tự tham số.

### 4.5 Gom logic tạo object vào một nơi

Controller không cần biết cách tạo docker-compose.
Service không cần biết chi tiết từng service trong YAML.
Builder chịu trách nhiệm tạo config.

### 4.6 Dễ test

Có thể test riêng:

- addAppService tạo đúng service
- enableRedis tạo đúng Redis config
- enablePostgres tạo đúng Postgres config
- setReplicas tạo đúng deploy.replicas

Trong project này, test builder không cần start HTTP server hay frontend. Test chỉ tạo builder, gọi chain method và kiểm tra object trả về.

### 4.7 Hỗ trợ nhiều output mà không trộn logic

Builder chỉ tạo object config. Formatter mới quyết định output là JSON hay YAML.

Vì vậy cùng một config object có thể xuất ra:

- `deploy-config.json`
- `docker-compose.yml`
- `docker-swarm.yml`

Nếu sau này thêm output như Kubernetes YAML, có thể thêm formatter/builder mới mà không cần nhét logic convert vào controller.

### 4.8 Dễ kiểm soát thứ tự build bằng Director

Một số bước phải chạy trước bước khác. Ví dụ phải có app service trước khi thêm env, replicas, health check hoặc dependencies.

`DeployConfigDirector` giúp gom thứ tự này vào một nơi:

```ts
builder
  .addAppService(...)
  .addEnvironment(...)
  .setReplicas(...);
```

Nhờ vậy frontend gửi option tùy ý, nhưng backend vẫn build theo thứ tự an toàn.

## 5. Nhược điểm trong dự án này

### 5.1 Tăng số lượng file/class

Trong dự án này, để áp dụng Builder Pattern rõ ràng, backend phải có nhiều file hơn:

- `deploy-config.builder.ts`
- `docker-compose.builder.ts`
- `swarm-compose.builder.ts`
- `deploy-config.director.ts`
- formatter JSON/YAML
- type definitions

Với app nhỏ, Builder có thể làm project phức tạp hơn cần thiết.

Ví dụ nếu chỉ generate một object có 3 field:

```json
{
  "appName": "api",
  "image": "api:latest",
  "port": 3000
}
```

thì dùng Builder là hơi dư.

### 5.2 Dễ bị lạm dụng

Không phải object nào cũng cần Builder.

Builder phù hợp khi:
- object nhiều field
- nhiều optional field
- nhiều bước build
- nhiều biến thể config

Không phù hợp khi:
- object đơn giản
- logic build không thay đổi
- chỉ CRUD bình thường

### 5.3 Có thể che giấu validation

Nếu không cẩn thận, builder có thể build ra config thiếu field.

Ví dụ gọi:

```ts
new DeployConfigBuilder()
  .enableRedis()
  .build();
```

Nhưng chưa gọi addAppService.

Cách xử lý:
- validate trong DTO
- validate trong build()
- hoặc dùng Director để đảm bảo thứ tự build

### 5.4 Dễ tạo builder quá lớn

Nếu tất cả logic nằm trong một DeployConfigBuilder, class này có thể phình to.

Trong dự án này, rủi ro sẽ tăng nếu tiếp tục thêm nhiều service như RabbitMQ, MinIO, Prometheus, Grafana, n8n, Nginx, Elasticsearch vào cùng một class.

Cách xử lý:
- tách DockerComposeBuilder
- tách SwarmComposeBuilder
- tách ServiceConfigFactory nếu cần
- tách Formatter riêng

### 5.5 Builder có thể phụ thuộc quá nhiều vào Docker Compose

Config hiện tại đang bám vào cấu trúc Docker Compose: `services`, `networks`, `volumes`, `deploy`, `healthcheck`.

Nếu sau này thêm Kubernetes output, không nên cố ép Kubernetes vào cùng `DeployConfigBuilder`. Kubernetes có resource khác như Deployment, Service, ConfigMap, Secret, Ingress.

Cách tốt hơn:

- giữ `DockerComposeBuilder` cho compose
- giữ `SwarmComposeBuilder` cho swarm
- thêm `KubernetesManifestBuilder` nếu cần Kubernetes

### 5.6 Chain method dễ bị gọi sai thứ tự nếu bỏ qua Director

Nếu developer gọi trực tiếp:

```ts
new DeployConfigBuilder()
  .enableWorker()
  .build();
```

Builder sẽ lỗi vì chưa có app service để worker lấy image và dependency.

Trong project này, `DeployConfigDirector` giảm rủi ro đó bằng cách luôn gọi `addAppService()` trước các optional service.

### 5.7 Một số option runtime chưa ảnh hưởng nhiều đến output

Form có `runtime: node | python | go`, nhưng Docker Compose output hiện tại chủ yếu dùng `image`, `port`, `env`.

Nếu muốn runtime có ý nghĩa hơn, builder cần thêm logic riêng cho từng runtime, ví dụ:

- Node worker command: `npm run worker`
- Python worker command: `python worker.py`
- Go worker command: `./worker`

Nếu không mở rộng, field runtime chỉ đóng vai trò metadata input, chưa tạo khác biệt lớn trong config.

## 6. So sánh Builder với Factory

Factory Pattern tập trung vào việc chọn loại object cần tạo.

Ví dụ:
- nếu outputType = json thì dùng JsonFormatter
- nếu outputType = yaml thì dùng YamlFormatter

Builder Pattern tập trung vào việc tạo một object phức tạp từng bước.

Trong hệ thống này:
- Builder dùng để tạo deploy config
- Factory có thể dùng để chọn formatter

Ví dụ:

```ts
const formatter = FormatterFactory.create(dto.outputType);
return formatter.format(config);
```

## 7. Khi nào nên dùng Builder trong hệ thống này?

Nên dùng khi:
- generate docker-compose có nhiều service optional
- cần support nhiều output style
- cần build config theo preset: basic, production, swarm
- muốn code dễ mở rộng

Không nên dùng khi:
- chỉ tạo một JSON đơn giản
- không có optional service
- không có nhiều biến thể config

## 8. Kết luận

Builder Pattern rất phù hợp với Deployment Config Generator vì deployment config là object phức tạp, có nhiều option bật/tắt và nhiều biến thể.

Tuy nhiên không nên lạm dụng. Nếu project chỉ generate config đơn giản thì dùng function thường là đủ.

Trong hệ thống này, Builder nên nằm ở backend, còn frontend chỉ là nơi nhập dữ liệu và preview output.
