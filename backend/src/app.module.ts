import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DeployConfigModule } from './deploy-config/deploy-config.module';

@Module({
  imports: [DeployConfigModule],
  controllers: [AppController],
})
export class AppModule {}
