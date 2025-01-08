import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsInt,
  Min,
  IsString,
  IsObject,
  IsIn,
} from 'class-validator';

export class GenericPaginationDto {
  @IsOptional()
  @IsInt()
  @Min(1, { message: 'The page must be at least 1' })
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1, { message: 'The limit must be at least 1.' })
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsObject()
  filters?: Record<string, any>;

  @IsString()
  @IsOptional()
  @IsIn(['ASC', 'DESC'], { message: 'Order must be ASC or DESC' })
  order?: 'ASC' | 'DESC' = 'DESC';
}
