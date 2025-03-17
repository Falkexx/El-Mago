import {
  ForbiddenException,
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
import { ExceptionType, PayloadType } from '#types';
import { IOrderRepositoryContract } from 'src/Application/Infra/Repositories/OrderRepository/IOrderRepository.contract';
import { PayPalCreateOrderResponse } from 'src/@types/paypal';
import { OrderEntity } from 'src/Application/Entities/Order.entity';
import { OrderItem } from 'src/Application/Entities/order-item.entity';

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

    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.isBanned || user.isDeleted) {
      throw new ForbiddenException({
        message: {
          ptBr: 'usuário banido ou deletado',
          engUs: 'user banned ou deleted',
          esp: 'usuario baneado o eliminado',
        },
      } as ExceptionType);
    }

    const order = await this.orderRepository.getOrderWithRelations(orderId);

    if (!order || order.userId !== payload.sub) {
      throw new NotFoundException({
        message: {
          engUs: 'order not exist',
          ptBr: 'o pedido não existe',
          esp: 'el orden no existe',
        },
      } as ExceptionType);
    }

    const isPaid = order.status.find((_status_) => _status_.status === 'PAID');

    if (isPaid) {
      throw new NotAcceptableException({
        message: {
          engUs: 'the order already paid',
          ptBr: 'o pedido já foi pago',
          esp: 'la orden de campra ya ha sido pagada',
        },
      } as ExceptionType);
    }

    const isReturned = order.status.find(
      (_status_) => _status_.status === 'RETURNED',
    );

    if (isReturned) {
      throw new NotAcceptableException({
        message: {
          engUs: 'the order was refiused',
          ptBr: 'o pedido foi negado',
          esp: 'la orden de compra fue rechazada',
        },
      } as ExceptionType);
    }

    const isCanceled = order.status.find(
      (_status_) => _status_.status === 'CANCELED',
    );

    if (isCanceled) {
      throw new NotAcceptableException({
        message: {
          engUs: 'the order was canceled',
          ptBr: 'o pedido foi cancelado',
          esp: 'el pedido fue cancelado',
        },
      } as ExceptionType);
    }

    const items = order.OrderItems.map(
      (_item_) =>
        ({
          name: _item_.name,
          quantity: _item_.quantity,
          unit_amount: {
            // currency_code: _item_.currency,
            currency_code: 'BRL',
            value: parseFloat(_item_.price_per_unit).toFixed(2),
          },
          description: _item_.description,
        }) as Item,
    );

    let createOrderResult: PayPalCreateOrderResponse;
    let orderUpdated: OrderEntity;

    // call payment api
    try {
      if (!order.paymentUrl) {
        createOrderResult = await this.paypalService.payOrder({
          items,
          orderId: order.id,
          amount: {
            currency_code: 'BRL',
            totalPrice: this.calculateToTalPrice(order.OrderItems),
          },
        });

        const approveLink = createOrderResult.links.find(
          (_link_) => _link_.rel === 'approve',
        );

        const orderUpdateEntity = Object.assign(order, {
          paymentUrl: approveLink.href,
          paymentId: createOrderResult.id,
        } as OrderEntity);

        orderUpdated = await this.orderRepository.update(
          { id: order.id },
          orderUpdateEntity,
        );
      }
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }

    const paymentUrl = order.paymentUrl ?? orderUpdated.paymentUrl;

    return {
      order: { ...order, orderUpdated },
      links: {
        href: paymentUrl,
        method: 'GET',
        rel: 'approve',
        'Content-type': 'text/html',
      },
    };
  }

  private calculateToTalPrice(orderItems: OrderItem[]) {
    const total = orderItems
      .reduce(
        (acc, curr) => acc + parseFloat(curr.price_per_unit) * curr.quantity,
        parseFloat('0.00'),
      )
      .toFixed(2);

    return total;
  }
}
