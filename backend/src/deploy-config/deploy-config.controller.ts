import { Body, Controller, Post } from '@nestjs/common';
import { DeployConfigService } from './deploy-config.service';
import { GenerateDeployConfigDto } from './dto/generate-deploy-config.dto';

@Controller('deploy-config')
export class DeployConfigController {
  constructor(private readonly deployConfigService: DeployConfigService) {}

  @Post('generate')
  generate(@Body() dto: GenerateDeployConfigDto) {
    return this.deployConfigService.generate(dto);
  }
}
