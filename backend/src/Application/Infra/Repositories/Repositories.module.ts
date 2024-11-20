import { Module } from '@nestjs/common';
import { UserTypeOrmRepository } from './UserRepository/UserTypeOrm.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/Application/Entities/User.entity';
import { AffiliateEntity } from 'src/Application/Entities/Affiliate.entity';
import { AffiliateTypeOrmRepository } from './AffiliateRepository/AffiliateTypeOrm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, AffiliateEntity])],
  providers: [UserTypeOrmRepository, AffiliateTypeOrmRepository],
  exports: [TypeOrmModule],
})
export class RepositoriesModule {}
