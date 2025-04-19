import { PayloadType } from '#types';
import { generateShortId } from '#utils';
import {
  ForbiddenException,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { TransactionProvider, TransactionType } from 'src/@metadata';
import { KEY_INJECTION } from 'src/@metadata/keys';
import { ROLE } from 'src/@metadata/roles';
import { TransactionEntity } from 'src/Application/Entities/Transactions.entity';
import { IAffiliateRepositoryContract } from 'src/Application/Infra/Repositories/AffiliateRepository/IAffiliate.repository-contract';
import { ITransactionRepositoryContract } from 'src/Application/Infra/Repositories/TransactionRepository/ITransaction.repository-contract';
import { IUserRepositoryContract } from 'src/Application/Infra/Repositories/UserRepository/IUserRepository.contract';
import { IWalletRepositoryContract } from 'src/Application/Infra/Repositories/WalletRepository/IWallet.repository-contract';
import { DataSource } from 'typeorm';
import { CreateWalletToAffiliateDto } from './Dtos/CreateWalletToAffiliate.dto';
import { WalletEntity } from 'src/Application/Entities/Wallet.entity';

@Injectable()
export class WalletService {
  constructor(
    @Inject(KEY_INJECTION.USER_REPOSITORY_CONTRACT)
    private readonly userRepository: IUserRepositoryContract,
    @Inject(KEY_INJECTION.AFFILIATE_REPOSITORY_CONTRACT)
    private readonly affiliateRepository: IAffiliateRepositoryContract,
    @Inject(KEY_INJECTION.WALLET_REPOSITORY)
    private readonly walletRepository: IWalletRepositoryContract,
    @Inject(KEY_INJECTION.TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepositoryContract,
    private readonly dataSource: DataSource,
  ) {}

  async getWallet(payload: PayloadType) {
    const trx = this.dataSource.createQueryRunner();
    try {
      await trx.startTransaction();

      const user = await this.userRepository.getBy({ id: payload.sub }, trx);

      if (!user) {
        throw new NotFoundException('user not found');
      }

      if (!user.affiliateId || !user.roles.includes(ROLE.AFFILIATE)) {
        throw new ForbiddenException('only affiliate to be access');
      }

      const affiliate = await this.affiliateRepository.getBy(
        {
          id: user.affiliateId,
        },
        trx,
      );

      if (!affiliate) {
        throw new NotFoundException('affiliate not found');
      }

      const wallet = await this.walletRepository.getBy(
        { affiliateId: affiliate.id },
        trx,
      );

      if (!wallet) {
        throw new NotFoundException('wallet not found');
      }

      return wallet;
    } catch (e) {
      await trx.rollbackTransaction();
      throw e;
    } finally {
      await trx.release();
    }
  }

  async makeDeposit({
    value,
    walletId,
    orderId,
  }: {
    value: string;
    walletId: string;
    orderId: string;
  }) {
    const trx = this.dataSource.createQueryRunner();

    try {
      await trx.startTransaction();
      const wallet = await this.walletRepository.getBy({ id: walletId }, trx);

      if (!wallet) {
        throw new NotFoundException('wallet not found');
      }

      await this.transactionRepository.create(
        {
          id: generateShortId(10),
          createdAt: new Date(),
          from: TransactionProvider.SERVER,
          to: TransactionProvider.AFFILIATE,
          type: TransactionType.DEPOSIT,
          value: value,
          walletId: wallet.id,
        } as TransactionEntity,
        trx,
      );

      const walletUpdated = await this.walletRepository.update(
        { id: walletId },
        {
          balance: wallet.balance + value,
          updatedAt: new Date(),
        },
        trx,
      );

      await trx.commitTransaction();

      return walletUpdated;
    } catch (e) {
      await trx.rollbackTransaction();
      throw e;
    } finally {
      await trx.release();
    }
  }

  async createWalletToAffiliate(affiliateDto: CreateWalletToAffiliateDto) {
    const trx = this.dataSource.createQueryRunner();

    try {
      await trx.connect();

      await trx.startTransaction();

      const affiliate = await this.affiliateRepository.getBy(
        {
          id: affiliateDto.affiliateId,
        },
        trx,
      );

      if (!affiliate || affiliate.deletedAt) {
        throw new NotFoundException('affiliate not found');
      }

      const user = await this.userRepository.getBy(
        { email: affiliate.email },
        trx,
      );

      if (!user || user.isDeleted) {
        throw new NotFoundException('user not found');
      }

      const walletExist = await this.walletRepository.getBy(
        {
          affiliateId: affiliate.id,
        },
        trx,
      );

      if (walletExist) {
        throw new NotAcceptableException('wallet already exist');
      }

      const wallet = this.walletRepository.create(
        {
          id: generateShortId(10),
          balance: '0.0',
          affiliateId: affiliate.id,
          deletedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          Affiliate: affiliate,
          Transactions: [],
        } as WalletEntity,
        trx,
      );

      await trx.commitTransaction();

      return wallet;
    } catch (e) {
      await trx.rollbackTransaction();

      throw e;
    } finally {
      await trx.release();
    }
  }

  makeWithdraw() {}
}
