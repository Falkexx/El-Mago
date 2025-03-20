import { Module } from '@nestjs/common';
import { PaymentController } from './Payment.controller';
import { PaymentService } from './Payment.service';
import { HttpModule } from '@nestjs/axios';
import { PaypalService } from './Paypal/Paypal.service';
import { PaypalWebHookService } from './Paypal/Paypal.webhook.service';
import { InfraCredentialsManagerModule } from '../InfraCredentialsManager/InfraCredentialsManager.module';

@Module({
  imports: [HttpModule, InfraCredentialsManagerModule],
  controllers: [PaymentController],
  providers: [PaymentService, PaypalService, PaypalWebHookService],
  exports: [PaymentService, PaypalService],
})
export class PaymentModule {}
