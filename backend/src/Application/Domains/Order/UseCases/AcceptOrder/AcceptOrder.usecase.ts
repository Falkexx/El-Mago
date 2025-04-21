import {
  ForbiddenException,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { KEY_INJECTION } from 'src/@metadata/keys';
import { IOrderRepositoryContract } from 'src/Application/Infra/Repositories/OrderRepository/IOrderRepository.contract';
import { AcceptOrderDto } from './AcceptOrder.dto';
import { PayloadType } from '#types';
import { IUserRepositoryContract } from 'src/Application/Infra/Repositories/UserRepository/IUserRepository.contract';
import { IAffiliateRepositoryContract } from 'src/Application/Infra/Repositories/AffiliateRepository/IAffiliate.repository-contract';
import { generateShortId } from '#utils';
import { OrderStatus } from 'src/Application/Entities/order-status.entity';
import { NodemailerService } from 'src/Application/Infra/Mail/Nodemailer/Nodemailer.service';
import { IWalletRepositoryContract } from 'src/Application/Infra/Repositories/WalletRepository/IWallet.repository-contract';
import { DataSource } from 'typeorm';

@Injectable()
export class AcceptOrderUseCase {
  constructor(
    @Inject(KEY_INJECTION.USER_REPOSITORY_CONTRACT)
    private readonly userRepository: IUserRepositoryContract,
    @Inject(KEY_INJECTION.ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepositoryContract,
    @Inject(KEY_INJECTION.AFFILIATE_REPOSITORY_CONTRACT)
    private readonly affiliateRepository: IAffiliateRepositoryContract,
    @Inject(KEY_INJECTION.WALLET_REPOSITORY)
    private readonly walletRepository: IWalletRepositoryContract,
    private readonly mainService: NodemailerService,
    private readonly dataSource: DataSource,
  ) {}

  async execute(payload: PayloadType, addAffiliateOnOrderDto: AcceptOrderDto) {
    const trx = this.dataSource.createQueryRunner();

    try {
      await trx.startTransaction();

      const user = await this.userRepository.getBy({ id: payload.sub }, trx);

      if (!user) {
        throw new UnauthorizedException();
      }

      const affiliate = await this.affiliateRepository.getBy(
        {
          id: user.affiliateId,
        },
        trx,
      );

      if (!user.affiliateId || !affiliate) {
        throw new ForbiddenException('only affiliate make this action');
      }

      const affiliateWallet = await this.walletRepository.getBy(
        {
          affiliateId: affiliate.id,
        },
        trx,
      );

      if (!affiliateWallet || affiliateWallet.deletedAt) {
        throw new NotAcceptableException('affiliate wallet not found');
      }

      const availableOrder = await this.orderRepository.getAvailableOrder(
        addAffiliateOnOrderDto.orderId,
        trx,
      );

      if (!availableOrder) {
        throw new NotFoundException('order not found');
      }

      const customer = await this.userRepository.getBy(
        {
          id: availableOrder.userId,
        },
        trx,
      );

      if (!customer) {
        throw new NotFoundException('customer not found');
      }

      await this.orderRepository.createOrderStatus(
        {
          id: generateShortId(20),
          createdAt: new Date(),
          title: `accept`,
          orderId: availableOrder.id,
          order: availableOrder,
          status: 'ACCEPT',
          description: `this order has been accept by ${affiliate.name}`,
        } as OrderStatus,
        trx,
      );

      const orderUpdated = await this.orderRepository.update(
        {
          id: availableOrder.id,
        },
        {
          Affiliate: affiliate,
        },
        trx,
      );

      this.mainService.send({
        emails: [affiliate.email],
        htmlContent: `
        <h1>Você acabou de aceitar a ordem: ${orderUpdated.name} </h1>
        <p>id: ${orderUpdated.id} </p>
        <p>preço total: $${orderUpdated.totalPrice} </p>
      `,
        name: 'EL-mago',
        subject: 'accept order',
        text: 'você aceitou a ordem x...',
      });

      this.mainService.send({
        emails: [customer.email],
        htmlContent: `
        <h1>Boas noticias ${orderUpdated.nickName}, o ${affiliate.name} vai prosseguir com o seu pedido</h1>
        <p>id: ${orderUpdated.id} </p>
        <p>preço total: $${orderUpdated.totalPrice} </p>
      `,
        name: 'EL-mago',
        subject: 'accept order',
        text: 'você aceitou a ordem x...',
      });

      await trx.commitTransaction();

      const { userId, paymentId, paymentUrl, affiliateId, ...rest } =
        orderUpdated;

      return rest;
    } catch (e) {
      await trx.rollbackTransaction();
      throw e;
    } finally {
      await trx.release();
    }
  }
}
