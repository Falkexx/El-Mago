import { Module } from '@nestjs/common';
import { PaymentController } from './Payment.controller';
import { PaymentService } from './Payment.service';
import { HttpModule } from '@nestjs/axios';
import { PaypalService } from './Paypal/Paypal.service';
import { InfraCredentialsManagerModule } from '../InfraCredentialsManager/InfraCredentialsManager.module';
import { BullModule } from '@nestjs/bullmq';
import { PaypalWebHookService } from './Paypal/Paypal.webhook.service';

@Module({
  imports: [
    HttpModule,
    InfraCredentialsManagerModule,
    BullModule.registerQueue({
      name: 'payment',
    }),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, PaypalService, PaypalWebHookService],
  exports: [PaymentService, PaypalService, PaypalWebHookService],
})
export class PaymentModule {}
