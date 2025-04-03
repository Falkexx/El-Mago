import {
  AccountEntity,
  AccountUniqueRefs,
  AccountUpdateEntity,
} from 'src/Application/Entities/Account.entity';
import { IBaseRepositoryContract } from '../IBase.repository-contract';

export interface IAccountRepositoryContract
  extends IBaseRepositoryContract<
    AccountEntity,
    AccountUpdateEntity,
    AccountUniqueRefs
  > {}
