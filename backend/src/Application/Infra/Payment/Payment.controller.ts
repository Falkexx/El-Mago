import { Body, Controller, Headers, Post } from '@nestjs/common';
import { PaypalWebHookService } from './Paypal/Paypal.webhook.service';

@Controller({ path: 'payment', version: '1' })
export class PaymentController {
  constructor(private readonly paypalWebHookService: PaypalWebHookService) {}

  @Post('paypal-webhook')
  paypalWebHook(@Body() body: any, @Headers() headers: any) {
    return this.paypalWebHookService.webhookResult(body, headers);
  }
}
