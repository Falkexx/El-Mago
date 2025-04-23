import { Module } from '@nestjs/common';
import { WalletService } from './Wallet.service';
import { WalletController } from './Wallet.controller';
import { KEY_INJECTION } from 'src/@metadata/keys';
import { UserTypeOrmRepository } from 'src/Application/Infra/Repositories/UserRepository/UserTypeOrm.repository';
import { AffiliateTypeOrmRepository } from 'src/Application/Infra/Repositories/AffiliateRepository/AffiliateTypeOrm.repository';
import { WalletTypeOrmRepository } from 'src/Application/Infra/Repositories/WalletRepository/WalletTypeOrm.repository';
import { TransactionTypeOrmRepository } from 'src/Application/Infra/Repositories/TransactionRepository/TransactionTypeOrm.repository';
import { RepositoriesModule } from 'src/Application/Infra/Repositories/Repositories.module';
import { MakeBankWithdrawalUseCase } from './UseCases/ MakeBankWithdrawal/ MakeBankWithdrawal.usecase';
import { PaymentModule } from 'src/Application/Infra/Payment/Payment.module';

@Module({
  imports: [RepositoriesModule, PaymentModule],
  controllers: [WalletController],
  providers: [
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
    WalletService,
    MakeBankWithdrawalUseCase,
  ],
  exports: [],
})
export class WalletModule {}
