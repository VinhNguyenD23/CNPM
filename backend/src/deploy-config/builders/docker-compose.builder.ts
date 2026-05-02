import { DeployConfigBuilder } from './deploy-config.builder';

export class DockerComposeBuilder extends DeployConfigBuilder {
  constructor() {
    super();
    this.setBaseVersion('3.9');
  }
}
