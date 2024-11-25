import { Transform } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ItemType } from 'src/@metadata';

export class CreateItemBodyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(ItemType)
  type: ItemType;

  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  @IsNumber()
  @Min(0)
  @IsOptional()
  amount?: number;

  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  @IsNumber()
  @Min(0)
  price: number;

  @Transform(({ value }) => {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  tags: string[];

  @IsNotEmpty()
  @IsString()
  description: string;
}

export class CreateItemImageDto {
  image: Express.Multer.File;
}

export type CreateItemDto = CreateItemBodyDto & CreateItemImageDto;
