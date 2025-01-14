import { IsNotEmpty, IsString } from 'class-validator';

export class ReqAffiliateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  discord: string;

  @IsString()
  @IsNotEmpty()
  battleTag: string;

  @IsString()
  @IsNotEmpty()
  characterName: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  cpf: string;
}
