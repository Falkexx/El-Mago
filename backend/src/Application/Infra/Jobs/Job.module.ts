import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { KEY_INJECTION, KEY_OF_QUEUE } from 'src/@metadata/keys';
import { MailModule } from '../Mail/Mail.module';
import { JobProducerService } from './Producer/Payment.producer';
import { JobConsumerService } from './Consumer/Payment.consumer';
import { PaymentModule } from '../Payment/Payment.module';
import { RepositoriesModule } from '../Repositories/Repositories.module';
import { OrderTypeOrmRepository } from '../Repositories/OrderRepository/OrderTypeOrm.repository';
import { UserTypeOrmRepository } from '../Repositories/UserRepository/UserTypeOrm.repository';
import { HttpModule } from '@nestjs/axios';
import { InfraCredentialsManagerModule } from '../InfraCredentialsManager/InfraCredentialsManager.module';

@Global()
@Module({
  imports: [
    RepositoriesModule,
    //Implement module of the service
    BullModule.registerQueue({
      name: KEY_OF_QUEUE.PAYMENT,
    }),
    MailModule,
    PaymentModule,
    HttpModule,
    InfraCredentialsManagerModule,
  ],
  providers: [
    {
      provide: KEY_INJECTION.ORDER_REPOSITORY,
      useClass: OrderTypeOrmRepository,
    },
    {
      provide: KEY_INJECTION.USER_REPOSITORY_CONTRACT,
      useClass: UserTypeOrmRepository,
    },
    JobProducerService,
    JobConsumerService,
  ],
  exports: [JobProducerService],
})
export class JobsModule {}
