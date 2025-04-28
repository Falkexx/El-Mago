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
import { ItemModel, ItemType } from 'src/@metadata';
import { ImageDto } from 'src/utils/validators';

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
  price: string;

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

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  server: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(ItemModel)
  itemModel: ItemModel;
}

export type CreateItemDto = CreateItemBodyDto & ImageDto;
