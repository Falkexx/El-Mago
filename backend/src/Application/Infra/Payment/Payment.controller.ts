import { Body, Controller, Post } from '@nestjs/common';

@Controller({ path: 'payment', version: '1' })
export class PaymentController {
  @Post()
  paypalWebHook(@Body() body: any) {
    console.log(body);
  }
}
