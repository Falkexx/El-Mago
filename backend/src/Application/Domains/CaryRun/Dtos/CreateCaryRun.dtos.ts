import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateCaryRunCategoryDto } from './CreateCaryRunCatetory.dto';

export class CreateCaryRunDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  @IsNumber()
  @Min(0)
  price: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  amount: number;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  description?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  image?: string;

  @IsString()
  categoryId: string;

  @ValidateNested({ each: true })
  @Type(() => CreateCaryRunCategoryDto)
  @IsOptional()
  CategoryDto?: CreateCaryRunCategoryDto;
}
