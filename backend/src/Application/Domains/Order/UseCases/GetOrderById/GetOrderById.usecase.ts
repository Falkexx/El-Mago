import { PayloadType } from '#types';
import { shortId } from '#utils';
import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Status } from 'src/@metadata';
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

    return order;
  }
}
