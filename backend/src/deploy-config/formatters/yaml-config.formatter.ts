import { dump } from 'js-yaml';
import { ConfigFormatter } from './config-formatter.interface';
import { DeployConfig } from '../types/deploy-config.type';

export class YamlConfigFormatter implements ConfigFormatter {
  format(config: DeployConfig): string {
    return dump(config, { lineWidth: 120, noRefs: true });
  }
}
