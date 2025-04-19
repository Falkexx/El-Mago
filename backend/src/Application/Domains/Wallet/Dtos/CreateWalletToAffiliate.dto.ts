import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateWalletToAffiliateDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(40)
  affiliateId: string;
}
