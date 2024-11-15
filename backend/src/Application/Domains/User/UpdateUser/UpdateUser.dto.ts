import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
}
