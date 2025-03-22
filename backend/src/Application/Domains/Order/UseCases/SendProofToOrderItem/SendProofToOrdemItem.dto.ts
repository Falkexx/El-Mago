import { IsNotEmpty, IsString } from 'class-validator';
import { ImageDto } from 'src/utils/validators';
import jwt from 'jsonwebtoken';

export class SendProofToOrderItemBody {
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsString()
  @IsNotEmpty()
  orderItemId: string;
}

export type SendProofToOrderItemDto = SendProofToOrderItemBody & ImageDto;
