import { IsNotEmpty, IsString, Length } from 'class-validator';

export class AddAffiliateOnOrderDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  orderId: string;
}
