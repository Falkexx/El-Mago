import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RefuseAffiliateOnWaitingListDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
