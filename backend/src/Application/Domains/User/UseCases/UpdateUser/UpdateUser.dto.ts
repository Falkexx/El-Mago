import {
  IsAlpha,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPort,
  IsString,
} from 'class-validator';
import { Languages } from 'src/@metadata';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  country?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  discord?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  numberPhone?: string;

  @IsString({ each: true })
  @IsEnum(Languages, { each: true })
  @IsArray()
  @IsOptional()
  fluentLanguages?: Languages[];
}
