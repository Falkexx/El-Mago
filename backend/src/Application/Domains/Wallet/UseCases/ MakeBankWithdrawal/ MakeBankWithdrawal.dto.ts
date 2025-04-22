import { IsNotEmpty, IsString } from 'class-validator';

export class MakeBankWithdrawalDto {
  @IsString()
  @IsNotEmpty()
  value: string;
}
