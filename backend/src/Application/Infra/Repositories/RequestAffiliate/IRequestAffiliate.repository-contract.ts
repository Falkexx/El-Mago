import {
  RequestAffiliateEntity,
  RequestAffiliateUnqRef,
  RequestAffiliateUpdateEntity,
} from 'src/Application/Entities/Request-Affiliate.entity';
import { IBaseRepositoryContract } from '../IBase.repository-contract';

export type IRequestAffiliateRepositoryContract = IBaseRepositoryContract<
  RequestAffiliateEntity,
  RequestAffiliateUpdateEntity,
  RequestAffiliateUnqRef
>;
