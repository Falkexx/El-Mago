import {
  AffiliateEntity,
  AffiliateEntityUniqueRefs,
  AffiliateUpdateEntity,
} from 'src/Application/Entities/Affiliate.entity';
import { IBaseRepositoryContract } from '../IBase.repository-contract';

export type IAffiliateRepositoryContract = IBaseRepositoryContract<
  AffiliateEntity,
  AffiliateUpdateEntity,
  AffiliateEntityUniqueRefs
>;
