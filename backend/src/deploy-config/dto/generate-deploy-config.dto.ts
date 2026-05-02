import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { EnvVariableDto } from './env-variable.dto';
import { outputTypes, OutputType } from '../types/output-type.type';
import { Runtime, runtimes } from '../types/runtime.type';

export class ServiceOptionsDto {
  @IsBoolean()
  redis: boolean;

  @IsBoolean()
  postgres: boolean;

  @IsBoolean()
  worker: boolean;

  @IsBoolean()
  haproxy: boolean;
}

export class GenerateDeployConfigDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z][a-zA-Z0-9-_]*$/, {
    message: 'App name must start with a letter and contain letters, numbers, dashes, or underscores',
  })
  appName: string;

  @IsIn(runtimes)
  runtime: Runtime;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsInt()
  @Min(1)
  @Max(65535)
  port: number;

  @IsInt()
  @Min(1)
  @Max(50)
  replicas: number;

  @IsString()
  @IsOptional()
  @Matches(/^\/[-a-zA-Z0-9/_]*$/, {
    message: 'Health check must start with /',
  })
  healthCheck?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EnvVariableDto)
  env: EnvVariableDto[];

  @IsObject()
  @ValidateNested()
  @Type(() => ServiceOptionsDto)
  services: ServiceOptionsDto;

  @IsIn(outputTypes)
  outputType: OutputType;
}
