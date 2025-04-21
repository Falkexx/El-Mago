import {
  AffiliateEntity,
  AffiliateEntityUniqueRefs,
  AffiliateUpdateEntity,
} from 'src/Application/Entities/Affiliate.entity';
import { IBaseRepositoryContract } from '../IBase.repository-contract';
import { QueryRunner } from 'typeorm';

export type IAffiliateRepositoryContract = IBaseRepositoryContract<
  AffiliateEntity,
  AffiliateUpdateEntity,
  AffiliateEntityUniqueRefs
> & {
  findConflictingFields(
    data: Partial<AffiliateEntity>,
    trx: QueryRunner,
  ): Promise<Partial<Record<keyof AffiliateEntity, string>>>;
};
