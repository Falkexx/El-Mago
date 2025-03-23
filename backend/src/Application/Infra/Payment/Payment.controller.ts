import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { JobProducerService } from '../Jobs/Producer/Payment.producer';

@Controller({ path: 'payment', version: '1' })
export class PaymentController {
  constructor(private readonly jobProducerService: JobProducerService) {}

  @Post('paypal-webhook')
  paypalWebHook(@Body() body: any, @Headers() headers: any) {
    console.log('web hook of payment is called');
    this.jobProducerService.confirmPayment({ body, headers });
  }
}
