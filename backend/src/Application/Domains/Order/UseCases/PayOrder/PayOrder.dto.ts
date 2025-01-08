import { IsNotEmpty, IsString } from 'class-validator';

export class PayOrderDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;
}
