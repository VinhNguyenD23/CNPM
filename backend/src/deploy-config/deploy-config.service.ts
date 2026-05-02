import { Injectable } from '@nestjs/common';
import { DeployConfigBuilder } from './builders/deploy-config.builder';
import { DockerComposeBuilder } from './builders/docker-compose.builder';
import { SwarmComposeBuilder } from './builders/swarm-compose.builder';
import { GenerateDeployConfigDto } from './dto/generate-deploy-config.dto';
import { JsonConfigFormatter } from './formatters/json-config.formatter';
import { YamlConfigFormatter } from './formatters/yaml-config.formatter';
import { DeployConfig } from './types/deploy-config.type';
import { OutputType } from './types/output-type.type';

export interface GenerateDeployConfigResponse {
  success: true;
  outputType: OutputType;
  fileName: string;
  config: string;
}

@Injectable()
export class DeployConfigService {
  private readonly jsonFormatter = new JsonConfigFormatter();
  private readonly yamlFormatter = new YamlConfigFormatter();

  generate(dto: GenerateDeployConfigDto): GenerateDeployConfigResponse {
    const builder =
      dto.outputType === 'swarm-compose'
        ? new SwarmComposeBuilder()
        : new DockerComposeBuilder();

    const config = this.buildConfig(dto, builder);
    const formatter = dto.outputType === 'json' ? this.jsonFormatter : this.yamlFormatter;

    return {
      success: true,
      outputType: dto.outputType,
      fileName: this.getFileName(dto.outputType),
      config: formatter.format(config),
    };
  }

  private buildConfig(dto: GenerateDeployConfigDto, builder: DeployConfigBuilder): DeployConfig {
    const env = Object.fromEntries(dto.env.map((item) => [item.key, item.value]));

    return builder
      .setBaseVersion('3.9')
      .addAppService({
        appName: dto.appName,
        image: dto.image,
        port: dto.port,
      })
      .addEnvironment(dto.appName, env)
      .enableRedisWhen(dto.services.redis)
      .enablePostgresWhen(dto.services.postgres)
      .enableWorkerWhen(dto.services.worker, dto.image)
      .enableHAProxyWhen(dto.services.haproxy)
      .setReplicas(dto.appName, dto.replicas)
      .addHealthCheckWhen(Boolean(dto.healthCheck), dto.appName, dto.healthCheck ?? '', dto.port)
      .build();
  }

  private getFileName(outputType: OutputType) {
    if (outputType === 'json') {
      return 'deploy-config.json';
    }

    if (outputType === 'swarm-compose') {
      return 'docker-swarm.yml';
    }

    return 'docker-compose.yml';
  }
}
