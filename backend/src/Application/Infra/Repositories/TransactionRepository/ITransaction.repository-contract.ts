import {
  TransactionEntity,
  TransactionUniqueRefs,
  TransactionUpdateEntity,
} from 'src/Application/Entities/Transactions.entity';
import { IBaseRepositoryContract } from '../IBase.repository-contract';

export interface ITransactionRepositoryContract
  extends IBaseRepositoryContract<
    TransactionEntity,
    TransactionUpdateEntity,
    TransactionUniqueRefs
  > {}
