import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateProviderDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsOptional()
  @IsBoolean()
  credit: boolean;
}
