import { Module } from '@nestjs/common';
import { AffiliateController } from './Affiliate.controller';
import { AffiliateService } from './Affiliate.service';
import { KEY_INJECTION } from 'src/@metadata/keys';
import { AffiliateTypeOrmRepository } from 'src/Application/Infra/Repositories/AffiliateRepository/AffiliateTypeOrm.repository';
import { UserTypeOrmRepository } from 'src/Application/Infra/Repositories/UserRepository/UserTypeOrm.repository';
import { RepositoriesModule } from 'src/Application/Infra/Repositories/Repositories.module';

@Module({
  imports: [RepositoriesModule],
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
    AffiliateService,
  ],
  exports: [AffiliateService],
})
export class AffiliateModule {}
