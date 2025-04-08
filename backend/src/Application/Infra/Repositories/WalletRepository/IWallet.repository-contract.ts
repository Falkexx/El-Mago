import {
  WalletEntity,
  WalletUniqueRefs,
  WalletUpdateEntity,
} from 'src/Application/Entities/Wallet.entity';
import { IBaseRepositoryContract } from '../IBase.repository-contract';

export interface IWalletRepositoryContract
  extends IBaseRepositoryContract<
    WalletEntity,
    WalletUpdateEntity,
    WalletUniqueRefs
  > {}
