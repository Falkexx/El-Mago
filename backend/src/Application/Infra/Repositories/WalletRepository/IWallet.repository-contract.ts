import {
  WalletEntity,
  WalletUniqueRefs,
  WalletUpdateEntity,
} from 'src/Application/Entities/Wallet.entity';
import { IBaseRepositoryContract } from '../IBase.repository-contract';
import { QueryRunner } from 'typeorm';

export interface IWalletRepositoryContract
  extends IBaseRepositoryContract<
    WalletEntity,
    WalletUpdateEntity,
    WalletUniqueRefs
  > {
  getWalletByAffiliateId(
    affiliateId: string,
    trx: QueryRunner,
  ): Promise<WalletEntity>;
}
