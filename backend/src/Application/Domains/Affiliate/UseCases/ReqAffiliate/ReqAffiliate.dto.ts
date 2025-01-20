import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';
import { Languages } from 'src/@metadata';

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
  @Matches(
    /(?:\+?\d{2,3}[ ]{0,4})?(?:(?:\(0?\d{2}\)|0?\d{2})[ ]{0,4})?(?:9[ .-]?)?\d{4}[ .-]?\d{4}/,
    {
      message: 'examples: +55 (35) 9923212559 | +5535992321234',
    },
  )
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  cpf: string;

  @IsString({ each: true })
  @IsArray()
  @IsEnum(Languages, { each: true })
  fluentLanguages: string[];
}
