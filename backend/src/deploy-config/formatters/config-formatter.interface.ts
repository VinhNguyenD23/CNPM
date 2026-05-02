import { DeployConfig } from '../types/deploy-config.type';

export interface ConfigFormatter {
  format(config: DeployConfig): string;
}
