import { Module } from '@nestjs/common';
import { AffiliateController } from './Affiliate.controller';
import { AffiliateService } from './Affiliate.service';
import { KEY_INJECTION } from 'src/@metadata/keys';
import { AffiliateTypeOrmRepository } from 'src/Application/Infra/Repositories/AffiliateRepository/AffiliateTypeOrm.repository';
import { UserTypeOrmRepository } from 'src/Application/Infra/Repositories/UserRepository/UserTypeOrm.repository';
import { RepositoriesModule } from 'src/Application/Infra/Repositories/Repositories.module';
import { ReqAffiliateUseCase } from './UseCases/ReqAffiliate/ReqAffiliate.usecase';
import { RequestAffiliateTypeOrmRepository } from 'src/Application/Infra/Repositories/RequestAffiliate/RequestAffiliateTypeOrm.repository';
import { MailModule } from 'src/Application/Infra/Mail/Mail.module';
import { ListAffiliatesOnHoldUseCase } from './UseCases/ListAffiliatesOnHold/ListAffiliatesOnHold.usecase';
import { ApproveAffiliateOnWaitingListUseCase } from './UseCases/ApproveAffiliateOnWaitingList/ApproveAffiliateOnWaitingList.usecase';
import { RefuseAffiliateOnWaitingListUseCase } from './UseCases/RefuseAffiliateOnWaitingList/RefuseAffiliateOnWaitingList.usecase';
import { WalletTypeOrmRepository } from 'src/Application/Infra/Repositories/WalletRepository/WalletTypeOrm.repository';

@Module({
  imports: [RepositoriesModule, MailModule],
  controllers: [AffiliateController],
  providers: [
    {
      provide: KEY_INJECTION.AFFILIATE_REPOSITORY_CONTRACT,
      useClass: AffiliateTypeOrmRepository,
    },
    {
      provide: KEY_INJECTION.USER_REPOSITORY_CONTRACT,
      useClass: UserTypeOrmRepository,
    },
    {
      provide: KEY_INJECTION.REQUEST_AFFILIATE_REPOSITORY,
      useClass: RequestAffiliateTypeOrmRepository,
    },
    {
      provide: KEY_INJECTION.WALLET_REPOSITORY,
      useClass: WalletTypeOrmRepository,
    },
    AffiliateService,
    ReqAffiliateUseCase,
    ListAffiliatesOnHoldUseCase,
    ApproveAffiliateOnWaitingListUseCase,
    RefuseAffiliateOnWaitingListUseCase,
  ],
  exports: [AffiliateService],
})
export class AffiliateModule {}
