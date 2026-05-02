import { Module } from '@nestjs/common';
import { DeployConfigController } from './deploy-config.controller';
import { DeployConfigService } from './deploy-config.service';

@Module({
  controllers: [DeployConfigController],
  providers: [DeployConfigService],
})
export class DeployConfigModule {}
