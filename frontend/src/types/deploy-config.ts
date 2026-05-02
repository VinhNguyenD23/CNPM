export type Runtime = 'node' | 'python' | 'go';
export type OutputType = 'json' | 'docker-compose' | 'swarm-compose';

export interface EnvVariable {
  key: string;
  value: string;
}

export interface ServiceOptions {
  redis: boolean;
  postgres: boolean;
  worker: boolean;
  haproxy: boolean;
}

export interface DeployConfigFormValues {
  appName: string;
  runtime: Runtime;
  image: string;
  port: number;
  replicas: number;
  healthCheck: string;
  env: EnvVariable[];
  services: ServiceOptions;
  outputType: OutputType;
}

export interface GenerateDeployConfigResponse {
  success: true;
  outputType: OutputType;
  fileName: string;
  config: string;
}
