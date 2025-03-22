import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { PaypalWebHookService } from './Paypal/Paypal.webhook.service';
import { JobProducerService } from '../Jobs/Producer/Payment.producer';

@Controller({ path: 'payment', version: '1' })
export class PaymentController {
  constructor(
    // private readonly paypalWebHookService: PaypalWebHookService,
    private readonly jobProducerService: JobProducerService,
  ) {}

  @Post('paypal-webhook')
  paypalWebHook(@Body() body: any, @Headers() headers: any) {
    console.log('controller as called');
    return this.jobProducerService.confirmPayment({ body, headers });
  }
}
