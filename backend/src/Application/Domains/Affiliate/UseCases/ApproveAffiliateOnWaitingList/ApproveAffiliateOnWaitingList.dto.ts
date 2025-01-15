import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ApproveAffiliateOnWaitingListDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
