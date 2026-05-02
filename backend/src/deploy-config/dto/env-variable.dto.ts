import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class EnvVariableDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z_][A-Z0-9_]*$/i, {
    message: 'Environment variable key must use letters, numbers, and underscores',
  })
  key: string;

  @IsString()
  value: string;
}
