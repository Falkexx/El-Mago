import { Module } from '@nestjs/common';
import { CaryRunController } from './CaryRun.controller';
import { CaryRunService } from './CaryRun.service';
import { KEY_INJECTION } from 'src/@metadata/keys';
import { UserTypeOrmRepository } from 'src/Application/Infra/Repositories/UserRepository/UserTypeOrm.repository';
import { AffiliateTypeOrmRepository } from 'src/Application/Infra/Repositories/AffiliateRepository/AffiliateTypeOrm.repository';
import { CaryRunTypeOrmRepository } from 'src/Application/Infra/Repositories/CaryRunRepository/CaryRunTypeorm.repository';
import { RepositoriesModule } from 'src/Application/Infra/Repositories/Repositories.module';

@Module({
  imports: [RepositoriesModule],
  controllers: [CaryRunController],
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
      provide: KEY_INJECTION.CARY_RUN_REPOSITORY,
      useClass: CaryRunTypeOrmRepository,
    },

    CaryRunService,
  ],
})
export class CaryRunModule {}
