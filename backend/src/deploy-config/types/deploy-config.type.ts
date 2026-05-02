export type EnvironmentMap = Record<string, string>;

export interface ComposeHealthCheck {
  test: string[];
  interval: string;
  timeout: string;
  retries: number;
}

export interface ComposeDeploy {
  replicas: number;
}

export interface ComposeService {
  image: string;
  command?: string;
  ports?: string[];
  environment?: EnvironmentMap;
  networks?: string[];
  depends_on?: string[];
  healthcheck?: ComposeHealthCheck;
  deploy?: ComposeDeploy;
  volumes?: string[];
}

export interface DeployConfig {
  version: string;
  services: Record<string, ComposeService>;
  networks: Record<string, { driver: string }>;
  volumes?: Record<string, unknown>;
}

export interface AppServiceInput {
  appName: string;
  image: string;
  port: number;
}
