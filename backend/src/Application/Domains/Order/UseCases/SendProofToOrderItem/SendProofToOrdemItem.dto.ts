import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class ProofItem {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(40)
  id: string;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;
}

export class SendProofToOrder {
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @ValidateNested()
  @Type(() => ProofItem)
  items: ProofItem[];
}
