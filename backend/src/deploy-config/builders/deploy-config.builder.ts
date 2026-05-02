import { AppServiceInput, DeployConfig, EnvironmentMap } from '../types/deploy-config.type';

export class DeployConfigBuilder {
  protected readonly appNetwork = 'app_network';
  protected appName?: string;
  protected config: DeployConfig = this.createEmptyConfig('3.9');

  setBaseVersion(version: string) {
    this.config.version = version;
    return this;
  }

  addAppService(input: AppServiceInput) {
    this.appName = input.appName;
    this.config.services[input.appName] = {
      image: input.image,
      ports: [`${input.port}:${input.port}`],
      environment: {},
      networks: [this.appNetwork],
    };

    return this;
  }

  addEnvironment(appName: string, env: EnvironmentMap) {
    this.ensureService(appName);
    this.config.services[appName].environment = env;
    return this;
  }

  setReplicas(appName: string, replicas: number) {
    this.ensureService(appName);
    this.config.services[appName].deploy = { replicas };
    return this;
  }

  addHealthCheck(appName: string, path: string, port: number) {
    this.ensureService(appName);
    this.config.services[appName].healthcheck = {
      test: ['CMD', 'wget', '--spider', `http://localhost:${port}${path}`],
      interval: '30s',
      timeout: '10s',
      retries: 3,
    };
    return this;
  }

  enableRedis() {
    this.config.services.redis = {
      image: 'redis:7',
      ports: ['6379:6379'],
      networks: [this.appNetwork],
    };
    this.addDependency('redis');
    return this;
  }

  enableRedisWhen(enabled: boolean) {
    return enabled ? this.enableRedis() : this;
  }

  enablePostgres() {
    this.config.services.postgres = {
      image: 'postgres:16',
      ports: ['5432:5432'],
      environment: {
        POSTGRES_USER: 'app',
        POSTGRES_PASSWORD: 'app',
        POSTGRES_DB: 'app',
      },
      volumes: ['postgres_data:/var/lib/postgresql/data'],
      networks: [this.appNetwork],
    };
    this.config.volumes = {
      ...this.config.volumes,
      postgres_data: {},
    };
    this.addDependency('postgres');
    return this;
  }

  enablePostgresWhen(enabled: boolean) {
    return enabled ? this.enablePostgres() : this;
  }

  enableWorker(image?: string) {
    const workerImage = image ?? this.getAppService().image;
    this.config.services.worker = {
      image: workerImage,
      command: 'npm run worker',
      environment: this.getAppService().environment ?? {},
      networks: [this.appNetwork],
      depends_on: this.appName ? [this.appName] : undefined,
    };
    return this;
  }

  enableWorkerWhen(enabled: boolean, image?: string) {
    return enabled ? this.enableWorker(image) : this;
  }

  enableHAProxy() {
    const appName = this.requireAppName();
    this.config.services.haproxy = {
      image: 'haproxy:2.9',
      ports: ['80:80'],
      networks: [this.appNetwork],
      depends_on: [appName],
    };
    return this;
  }

  enableHAProxyWhen(enabled: boolean) {
    return enabled ? this.enableHAProxy() : this;
  }

  addHealthCheckWhen(enabled: boolean, appName: string, path: string, port: number) {
    return enabled ? this.addHealthCheck(appName, path, port) : this;
  }

  build(): DeployConfig {
    this.requireAppName();
    return structuredClone(this.config);
  }

  protected createEmptyConfig(version: string): DeployConfig {
    return {
      version,
      services: {},
      networks: {
        [this.appNetwork]: {
          driver: 'bridge',
        },
      },
    };
  }

  protected addDependency(serviceName: string) {
    if (!this.appName) {
      return;
    }

    const service = this.config.services[this.appName];
    service.depends_on = Array.from(new Set([...(service.depends_on ?? []), serviceName]));
  }

  protected getAppService() {
    const appName = this.requireAppName();
    return this.config.services[appName];
  }

  protected ensureService(name: string) {
    if (!this.config.services[name]) {
      throw new Error(`Service ${name} has not been added`);
    }
  }

  protected requireAppName() {
    if (!this.appName) {
      throw new Error('App service must be added before building config');
    }

    return this.appName;
  }
}
