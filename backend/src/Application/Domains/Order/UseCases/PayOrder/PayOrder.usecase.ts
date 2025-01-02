import {
  Inject,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { KEY_INJECTION } from 'src/@metadata/keys';
import {
  Item,
  PaypalService,
} from 'src/Application/Infra/Payment/Paypal/Paypal.service';
import { IUserRepositoryContract } from 'src/Application/Infra/Repositories/UserRepository/IUserRepository.contract';
import { DataSource } from 'typeorm';
import { PayOrderDto } from './PayOrder.dto';
import { PayloadType } from '#types';
import { IOrderRepositoryContract } from 'src/Application/Infra/Repositories/OrderRepository/IOrderRepository.contract';
import { PayPalCreateOrderResponse } from 'src/@types/paypal';

export class PayOrderUseCase {
  constructor(
    @Inject(KEY_INJECTION.USER_REPOSITORY_CONTRACT)
    private readonly userRepository: IUserRepositoryContract,
    private readonly paypalService: PaypalService,
    private readonly dataSource: DataSource,
    @Inject(KEY_INJECTION.ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepositoryContract,
  ) {}

  async execute(payload: PayloadType, { orderId }: PayOrderDto) {
    const user = await this.userRepository.getBy({ id: payload.sub });

    if (!user || user.isBanned || user.isDeleted) {
      throw new UnauthorizedException();
    }

    const order = await this.orderRepository.getOrderWithRelations(orderId);

    if (!order || order.userId !== payload.sub) {
      throw new NotFoundException('order not found');
    }

    const totalPrice = order.OrderItems.reduce(
      (acc, curr) => acc + parseFloat(curr.price),
      parseFloat('0.00'),
    ).toFixed(2);

    console.log(totalPrice);

    const isPaid = order.status.find((_status_) => _status_.status === 'PAID');

    if (isPaid) {
      throw new NotAcceptableException('order already paid');
    }

    const isReturned = order.status.find(
      (_status_) => _status_.status === 'RETURNED',
    );

    if (isReturned) {
      throw new NotAcceptableException('order returned');
    }

    const isCanceled = order.status.find(
      (_status_) => _status_.status === 'CANCELED',
    );

    if (isCanceled) {
      throw new NotAcceptableException('order canceled');
    }
    const items = order.OrderItems.map((_item_) => {
      return {
        name: _item_.name,
        quantity: _item_.quantity,
        unit_amount: {
          currency_code: _item_.currency,
          value: parseFloat(_item_.price).toFixed(2),
        },
        description: _item_.description,
      } as Item;
    });

    let createOrderResult: PayPalCreateOrderResponse;

    try {
      createOrderResult = await this.paypalService.payOrder({
        items,
        orderId: order.id,
        amount: {
          currency_code: 'USD',
          totalPrice,
        },
      });
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }

    return {
      order,
      links: {
        href: createOrderResult.links[1].href,
        method: createOrderResult.links[1].method,
        rel: createOrderResult.links[1].rel,
      },
    };
  }
}
