import { BullModule } from '@nestjs/bullmq';
import { BullMetadataAccessor } from '@nestjs/bullmq/dist/bull-metadata.accessor';
import { Global, Module } from '@nestjs/common';
import { KEY_OF_QUEUE } from 'src/@metadata/keys';
import { MailModule } from '../Mail/Mail.module';
import { JobProducerService } from './Producer/Payment.producer';
import { JobConsumerService } from './Consumer/Payment.consumer';
import { PaypalWebHookService } from '../Payment/Paypal/Paypal.webhook.service';
import { PaymentModule } from '../Payment/Payment.module';

@Global()
@Module({
  imports: [
    //Implement module of the service
    BullModule.registerQueue({
      name: KEY_OF_QUEUE.PAYMENT,
    }),
    MailModule,
    PaymentModule,
  ],
  providers: [JobProducerService, JobConsumerService],
  exports: [JobProducerService],
})
export class JobsModule {}
