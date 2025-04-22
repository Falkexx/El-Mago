import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { KEY_INJECTION, KEY_OF_JOB, KEY_OF_QUEUE } from 'src/@metadata/keys';
import { MakeDepositProps } from '../Producer/Transaction.producer';
import {
  Inject,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { IAffiliateRepositoryContract } from '../../Repositories/AffiliateRepository/IAffiliate.repository-contract';
import { IOrderRepositoryContract } from '../../Repositories/OrderRepository/IOrderRepository.contract';
import { IWalletRepositoryContract } from '../../Repositories/WalletRepository/IWallet.repository-contract';
import { ITransactionRepositoryContract } from '../../Repositories/TransactionRepository/ITransaction.repository-contract';
import { DataSource } from 'typeorm';
import { TransactionEntity } from 'src/Application/Entities/Transactions.entity';
import { TransactionProvider, TransactionType } from 'src/@metadata';
import { env, generateShortId } from '#utils';
import { IUserRepositoryContract } from '../../Repositories/UserRepository/IUserRepository.contract';

@Processor(KEY_OF_QUEUE.TRANSACTION)
export class TransactionConsumer extends WorkerHost {
  constructor(
    @Inject(KEY_INJECTION.AFFILIATE_REPOSITORY_CONTRACT)
    private readonly affiliateRepository: IAffiliateRepositoryContract,
    @Inject(KEY_INJECTION.ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepositoryContract,
    @Inject(KEY_INJECTION.WALLET_REPOSITORY)
    private readonly walletRepository: IWalletRepositoryContract,
    @Inject(KEY_INJECTION.TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepositoryContract,
    @Inject(KEY_INJECTION.USER_REPOSITORY_CONTRACT)
    private readonly userRepository: IUserRepositoryContract,
    private readonly dataSource: DataSource,
  ) {
    super();
  }

  process(job: Job, token?: string): Promise<any> {
    const data = job.data;
    if (job.name === KEY_OF_JOB.MAKE_DEPOSIT) {
      return this.makeDeposit(data);
    }
  }

  private async makeDeposit(data: MakeDepositProps) {
    console.log('make deposit job called', data);
    const trx = this.dataSource.createQueryRunner();

    try {
      await trx.startTransaction();
      const order = await this.orderRepository.getBy({ id: data.orderId }, trx);

      if (!order) {
        console.error('order not found', data.orderId);
        throw new NotFoundException('Order not found');
      }

      //make deposit to affiliate
      const affiliate = await this.affiliateRepository.getBy(
        {
          id: order.affiliateId,
        },
        trx,
      );

      if (!affiliate) {
        console.error('affiliate not found');
        throw new NotFoundException('affiliate not found');
      }

      const wallet = await this.walletRepository.getBy(
        {
          affiliateId: affiliate.id,
        },
        trx,
      );

      if (!wallet) {
        console.error('wallet not found');
        throw new NotAcceptableException('affiliate not have wallet');
      }

      await this.walletRepository.update(
        {
          id: wallet.id,
        },
        {
          balance: (
            parseFloat(wallet.balance) + parseFloat(order.totalPrice)
          ).toString(), // TODO: create payment split
          updatedAt: new Date(),
        },
        trx,
      );

      await this.transactionRepository.create(
        {
          id: generateShortId(20),
          createdAt: new Date(),
          from: TransactionProvider.SERVER,
          to: TransactionProvider.AFFILIATE,
          type: TransactionType.DEPOSIT,
          value: order.totalPrice, // TODO: implement discount value
          walletId: wallet.id,
          orderId: order.id,
        } as TransactionEntity,
        trx,
      );

      // make deposit to admin
      const admin = await this.userRepository.getBy(
        { email: env.ADMIN_EMAIL },
        trx,
      );

      if (!admin) {
        throw new InternalServerErrorException('admin not found');
      }

      const adminWallet = await this.walletRepository.getBy(
        { affiliateId: admin.id },
        trx,
      );

      await this.transactionRepository.create(
        {
          id: generateShortId(20),
          createdAt: new Date(),
          from: TransactionProvider.SERVER,
          to: TransactionProvider.ADMIN,
          orderId: order.id,
          type: TransactionType.DEPOSIT,
          value: order.totalPrice, // TODO: calculate value to admin receive
          walletId: adminWallet.id,
          Wallet: adminWallet,
        },
        trx,
      );

      await this.walletRepository.update(
        {
          id: wallet.id,
        },
        {
          balance: (
            parseFloat(adminWallet.balance) + parseFloat(order.totalPrice)
          ).toString(), // TODO: create payment split
          updatedAt: new Date(),
        },
        trx,
      );

      await trx.commitTransaction();
    } catch (error) {
      console.error('error when make deposit', error);
      await trx.rollbackTransaction();
      throw error;
    } finally {
      await trx.release();
    }
  }
}
