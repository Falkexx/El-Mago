import { PayloadType } from '#types';
import { shortId } from '#utils';
import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { KEY_INJECTION } from 'src/@metadata/keys';
import { OrderStatus } from 'src/Application/Entities/order-status.entity';
import { PaypalService } from 'src/Application/Infra/Payment/Paypal/Paypal.service';
import { IOrderRepositoryContract } from 'src/Application/Infra/Repositories/OrderRepository/IOrderRepository.contract';
import { IUserRepositoryContract } from 'src/Application/Infra/Repositories/UserRepository/IUserRepository.contract';

@Injectable()
export class GetOrderByIdUseCase {
  constructor(
    @Inject(KEY_INJECTION.USER_REPOSITORY_CONTRACT)
    private readonly userRepository: IUserRepositoryContract,
    @Inject(KEY_INJECTION.ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepositoryContract,
    private readonly paypalService: PaypalService,
  ) {}

  async execute(payload: PayloadType, orderId: string) {
    const user = await this.userRepository.getBy({ id: payload.sub });

    if (!user) {
      throw new UnauthorizedException();
    }

    const order = await this.orderRepository.getBy({ id: orderId });

    if (!order || order.userId !== payload.sub) {
      throw new NotFoundException('order not found');
    }

    const isPaid = order.status.find((_status_) => _status_.status === 'PAID');

    const paypalOrder =
      await this.paypalService.checkOrder('4CN72590V0448541W');
    console.log(paypalOrder);

    if (isPaid && paypalOrder.status === 'APPROVED') {
      return order;
    }

    if (paypalOrder.status === 'APPROVED') {
      const newOrderStatus = Object.assign(new OrderStatus(), {
        id: shortId(),
        order: order,
        status: 'PAID',
        title: 'order is paid',
        description: 'paid successful',
        createdAt: new Date(),
      } as OrderStatus);

      return this.orderRepository.createOrderStatus(newOrderStatus);
    }

    return order;
  }
}
