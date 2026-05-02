import { ConfigFormatter } from './config-formatter.interface';
import { DeployConfig } from '../types/deploy-config.type';

export class JsonConfigFormatter implements ConfigFormatter {
  format(config: DeployConfig): string {
    return JSON.stringify(config, null, 2);
  }
}
