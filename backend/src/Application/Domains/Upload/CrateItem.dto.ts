import { IsNotEmpty, IsString } from 'class-validator';

export class CreateItemBodyDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}

export class CreateItemImageDto {
  image: Express.Multer.File;
}

export type CreateItemDto = CreateItemBodyDto & CreateItemImageDto;
