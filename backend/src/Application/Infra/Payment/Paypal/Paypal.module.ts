import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PaypalService } from './Paypal.service';

@Module({
  imports: [HttpModule],
  providers: [PaypalService],
  exports: [PaypalService],
})
export class PaypalModule {}
