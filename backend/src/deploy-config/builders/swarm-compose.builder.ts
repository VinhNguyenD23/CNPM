import { DeployConfigBuilder } from './deploy-config.builder';

export class SwarmComposeBuilder extends DeployConfigBuilder {
  constructor() {
    super();
    this.setBaseVersion('3.9');
  }

  enableHAProxy() {
    super.enableHAProxy();
    this.config.services.haproxy.deploy = { replicas: 1 };
    return this;
  }
}
