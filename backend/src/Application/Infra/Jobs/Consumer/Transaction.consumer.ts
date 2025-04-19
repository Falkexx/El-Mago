import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { KEY_INJECTION, KEY_OF_JOB, KEY_OF_QUEUE } from 'src/@metadata/keys';
import { MakeDepositProps } from '../Producer/Transaction.producer';
import {
  Inject,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { IAffiliateRepositoryContract } from '../../Repositories/AffiliateRepository/IAffiliate.repository-contract';
import { IOrderRepositoryContract } from '../../Repositories/OrderRepository/IOrderRepository.contract';
import { IWalletRepositoryContract } from '../../Repositories/WalletRepository/IWallet.repository-contract';
import { ITransactionRepositoryContract } from '../../Repositories/TransactionRepository/ITransaction.repository-contract';
import { DataSource } from 'typeorm';
import { generateShortId } from '#utils';
import { TransactionEntity } from 'src/Application/Entities/Transactions.entity';
import { TransactionProvider, TransactionType } from 'src/@metadata';

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
    const trx = this.dataSource.createQueryRunner();

    console.log('make deposit job ', data);

    try {
      // await trx.startTransaction();
      // const order = await this.orderRepository.getBy({ id: data.orderId });
      // if (!order) {
      //   throw new NotFoundException('Order not found');
      // }
      // const affiliate = await this.affiliateRepository.getBy(
      //   {
      //     id: order.affiliateId,
      //   },
      //   trx,
      // );
      // if (!affiliate) {
      //   throw new NotFoundException('affiliate not found');
      // }
      // const wallet = await this.walletRepository.getBy(
      //   {
      //     affiliateId: affiliate.id,
      //   },
      //   trx,
      // );
      // if (!wallet) {
      //   throw new NotAcceptableException('affiliate not have wallet');
      // }
      // await this.transactionRepository.create({
      //   id: generateShortId(20),
      //   createdAt: new Date(),
      //   from: TransactionProvider.SERVER,
      //   to: TransactionProvider.AFFILIATE,
      //   type: TransactionType.DEPOSIT,
      //   value: order.totalPrice, // TODO: implement discount value
      //   walletId: wallet.id,
      //   orderId: order.id,
      // } as TransactionEntity);
      // await trx.commitTransaction();
    } catch (error) {
      await trx.rollbackTransaction();
      throw error;
    } finally {
      await trx.release();
    }
  }
}
