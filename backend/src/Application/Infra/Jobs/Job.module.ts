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
import { TransactionConsumer } from './Consumer/Transaction.consumer';
import { TransactionProducer } from './Producer/Transaction.producer';
import { AffiliateTypeOrmRepository } from '../Repositories/AffiliateRepository/AffiliateTypeOrm.repository';
import { WalletTypeOrmRepository } from '../Repositories/WalletRepository/WalletTypeOrm.repository';
import { TransactionTypeOrmRepository } from '../Repositories/TransactionRepository/TransactionTypeOrm.repository';

@Global()
@Module({
  imports: [
    RepositoriesModule,
    //Implement module of the service
    BullModule.registerQueue({
      name: KEY_OF_QUEUE.PAYMENT,
    }),
    BullModule.registerQueue({
      name: KEY_OF_QUEUE.TRANSACTION,
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
    {
      provide: KEY_INJECTION.AFFILIATE_REPOSITORY_CONTRACT,
      useClass: AffiliateTypeOrmRepository,
    },
    {
      provide: KEY_INJECTION.WALLET_REPOSITORY,
      useClass: WalletTypeOrmRepository,
    },
    {
      provide: KEY_INJECTION.TRANSACTION_REPOSITORY,
      useClass: TransactionTypeOrmRepository,
    },
    JobProducerService,
    JobConsumerService,
    TransactionConsumer,
    TransactionProducer,
  ],
  exports: [JobProducerService, TransactionProducer],
})
export class JobsModule {}
