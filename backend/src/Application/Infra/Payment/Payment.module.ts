import { Module } from '@nestjs/common';
import { PaymentController } from './Payment.controller';
import { PaymentService } from './Payment.service';
import { HttpModule } from '@nestjs/axios';
import { PaypalService } from './Paypal/Paypal.service';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'payment',
    }),
    HttpModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService, PaypalService],
  exports: [PaymentService, PaypalService],
})
export class PaymentModule {}
