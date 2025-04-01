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
import { OrderEntity } from 'src/Application/Entities/Order.entity';
import { OrderStatus } from 'src/Application/Entities/order-status.entity';
import { NodemailerService } from 'src/Application/Infra/Mail/Nodemailer/Nodemailer.service';

@Injectable()
export class AcceptOrderUseCase {
  constructor(
    @Inject(KEY_INJECTION.USER_REPOSITORY_CONTRACT)
    private readonly userRepository: IUserRepositoryContract,
    @Inject(KEY_INJECTION.ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepositoryContract,
    @Inject(KEY_INJECTION.AFFILIATE_REPOSITORY_CONTRACT)
    private readonly affiliateRepository: IAffiliateRepositoryContract,
    private readonly mainService: NodemailerService,
  ) {}

  async execute(payload: PayloadType, addAffiliateOnOrderDto: AcceptOrderDto) {
    const user = await this.userRepository.getBy({ id: payload.sub });

    if (!user) {
      throw new UnauthorizedException();
    }

    const affiliate = await this.affiliateRepository.getBy({
      id: user.affiliateId,
    });

    if (!user.affiliateId || !affiliate) {
      throw new ForbiddenException('only affiliate make this action');
    }

    const availableOrder = await this.orderRepository.getAvailableOrder(
      addAffiliateOnOrderDto.orderId,
    );

    if (!availableOrder) {
      throw new NotFoundException('order not found');
    }

    const customer = await this.userRepository.getBy({
      id: availableOrder.userId,
    });

    if (!customer) {
      throw new NotFoundException('customer not found');
    }

    await this.orderRepository.createOrderStatus({
      id: generateShortId(20),
      createdAt: new Date(),
      title: `accept`,
      orderId: availableOrder.id,
      order: availableOrder,
      status: 'ACCEPT',
      description: `this order has been accept by ${affiliate.name}`,
    } as OrderStatus);

    const orderUpdated = await this.orderRepository.update(
      {
        id: availableOrder.id,
      },
      {
        Affiliate: affiliate,
      },
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

    return orderUpdated;
  }
}
