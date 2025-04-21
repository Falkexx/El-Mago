import { PayloadType } from '#types';
import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { MakeBankWithdrawalDto } from './ MakeBankWithdrawal.dto';
import { KEY_INJECTION } from 'src/@metadata/keys';
import { IUserRepositoryContract } from 'src/Application/Infra/Repositories/UserRepository/IUserRepository.contract';
import { DataSource } from 'typeorm';
import { ITransactionRepositoryContract } from 'src/Application/Infra/Repositories/TransactionRepository/ITransaction.repository-contract';
import { IWalletRepositoryContract } from 'src/Application/Infra/Repositories/WalletRepository/IWallet.repository-contract';
import { PaypalService } from 'src/Application/Infra/Payment/Paypal/Paypal.service';
import { IAffiliateRepositoryContract } from 'src/Application/Infra/Repositories/AffiliateRepository/IAffiliate.repository-contract';
import { generateShortId } from '#utils';

@Injectable()
export class MakeBankWithdrawalUseCase {
  constructor(
    @Inject(KEY_INJECTION.USER_REPOSITORY_CONTRACT)
    private readonly userRepository: IUserRepositoryContract,
    @Inject(KEY_INJECTION.TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepositoryContract,
    @Inject(KEY_INJECTION.AFFILIATE_REPOSITORY_CONTRACT)
    private readonly affiliateRepository: IAffiliateRepositoryContract,
    @Inject(KEY_INJECTION.WALLET_REPOSITORY)
    private readonly walletRepository: IWalletRepositoryContract,
    private readonly dataSource: DataSource,
    private readonly paypalService: PaypalService,
  ) {}

  async execute(payload: PayloadType, mkBWDto: MakeBankWithdrawalDto) {
    const trx = this.dataSource.createQueryRunner();

    try {
      await trx.startTransaction();

      const user = await this.userRepository.getBy({ id: payload.sub }, trx);

      if (!user) {
        throw new UnauthorizedException();
      }

      const affiliate = await this.affiliateRepository.getBy(
        {
          email: user.email,
        },
        trx,
      );

      if (!affiliate) {
        throw new ForbiddenException(
          'only affiliate can be access this method',
        );
      }

      const wallet = await this.walletRepository.getBy(
        {
          affiliateId: affiliate.id,
        },
        trx,
      );

      if (!wallet || wallet.deletedAt) {
        throw new InternalServerErrorException('wallet not found');
      }

      if (parseFloat(wallet.balance) < parseFloat(mkBWDto.value)) {
        throw new NotAcceptableException(
          'insufficient balance for this amount',
        );
      }

      const newTransaction = await this.transactionRepository.create(
        {
          id: generateShortId(20),
          createdAt: new Date(),
          from: 'SERVER',
          to: 'SERVER',
          type: 'WITHDRAWAL',
          value: mkBWDto.value,
          orderId: null,
          Wallet: wallet,
          walletId: wallet.id,
        },
        trx,
      );

      await this.paypalService.makeBankWithdrawal({
        email: affiliate.email,
        value: mkBWDto.value,
      });

      // TODO: send email confirm the withdrawal

      await trx.commitTransaction();

      return {
        transaction: newTransaction,
      };
    } catch (e) {
      await trx.rollbackTransaction();

      // TODO: send email decline the withdrawal

      throw e;
    } finally {
      await trx.release();
    }
  }
}
