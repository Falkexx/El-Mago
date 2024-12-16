import { IsNotEmpty, IsString } from 'class-validator';

export class AssignCategoryDto {
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  itemId: string;
}
