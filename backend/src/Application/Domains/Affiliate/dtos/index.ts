import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateAffiliateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @Matches(
    /(?:\+?\d{2,3}[ ]{0,4})?(?:(?:\(0?\d{2}\)|0?\d{2})[ ]{0,4})?(?:9[ .-]?)?\d{4}[ .-]?\d{4}/,
    {
      message: 'examples: +55 (35) 9923212559 | +5535992321234',
    },
  )
  numberPhone: string;

  @IsString()
  @IsNotEmpty()
  cpfCnpj: string;

  @IsString()
  @IsNotEmpty()
  gameNickName: string;

  @IsString()
  @IsNotEmpty()
  photo: string;
}
