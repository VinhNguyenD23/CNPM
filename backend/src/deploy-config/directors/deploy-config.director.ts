import { GenerateDeployConfigDto } from '../dto/generate-deploy-config.dto';
import { DeployConfigBuilder } from '../builders/deploy-config.builder';
import { DeployConfig } from '../types/deploy-config.type';

export class DeployConfigDirector {
  build(dto: GenerateDeployConfigDto, builder: DeployConfigBuilder): DeployConfig {
    const env = Object.fromEntries(dto.env.map((item) => [item.key, item.value]));

    builder
      .setBaseVersion('3.9')
      .addAppService({
        appName: dto.appName,
        image: dto.image,
        port: dto.port,
      })
      .addEnvironment(dto.appName, env)
      .setReplicas(dto.appName, dto.replicas);

    if (dto.healthCheck) {
      builder.addHealthCheck(dto.appName, dto.healthCheck, dto.port);
    }

    if (dto.services.redis) {
      builder.enableRedis();
    }

    if (dto.services.postgres) {
      builder.enablePostgres();
    }

    if (dto.services.worker) {
      builder.enableWorker(dto.image);
    }

    if (dto.services.haproxy) {
      builder.enableHAProxy();
    }

    return builder.build();
  }
}
