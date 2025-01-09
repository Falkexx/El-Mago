import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PLATFORM } from 'src/@metadata';

export class CreateOrderDto {
  @IsString()
  server: string;

  @IsString()
  @IsOptional()
  @IsEnum(PLATFORM)
  platform?: PLATFORM;

  @IsString()
  nickName: string;

  @IsString()
  battleTag: string;
}
