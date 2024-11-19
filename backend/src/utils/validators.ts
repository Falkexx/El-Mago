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
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1, { message: 'The limit must be at least 1.' })
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
  order?: 'ASC' | 'DESC';
}
