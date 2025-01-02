import { Injectable } from '@nestjs/common';
import { PaypalService } from 'src/Application/Infra/Payment/Paypal/Paypal.service';

@Injectable()
export class OrderService {
  constructor(private readonly paypalService: PaypalService) {}

  async execute() {
    await this.paypalService.payOrderWithCard({ teste: '' });
  }
}
