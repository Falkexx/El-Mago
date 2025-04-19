import {
  ForbiddenException,
  Inject,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  NotImplementedException,
  UnauthorizedException,
} from '@nestjs/common';
import { KEY_INJECTION } from 'src/@metadata/keys';
import { Item } from 'src/Application/Infra/Payment/Paypal/Paypal.service';
import { IUserRepositoryContract } from 'src/Application/Infra/Repositories/UserRepository/IUserRepository.contract';
import { DataSource } from 'typeorm';
import { PayOrderDto } from './PayOrder.dto';
import { ExceptionType, PayloadType } from '#types';
import { IOrderRepositoryContract } from 'src/Application/Infra/Repositories/OrderRepository/IOrderRepository.contract';
import { OrderEntity } from 'src/Application/Entities/Order.entity';
import { OrderItem } from 'src/Application/Entities/order-item.entity';
import {
  PaymentMethod,
  PaymentProvider,
  PaymentService,
} from 'src/Application/Infra/Payment/Payment.service';
import { HttpStatusCode } from 'axios';

export class PayOrderUseCase {
  constructor(
    @Inject(KEY_INJECTION.USER_REPOSITORY_CONTRACT)
    private readonly userRepository: IUserRepositoryContract,
    private readonly dataSource: DataSource,
    @Inject(KEY_INJECTION.ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepositoryContract,
    private readonly paymentService: PaymentService,
  ) {}

  async execute(payload: PayloadType, { orderId }: PayOrderDto) {
    const trx = this.dataSource.createQueryRunner();

    try {
      await trx.startTransaction();

      const user = await this.userRepository.getBy({ id: payload.sub }, trx);

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
          statusCode: HttpStatusCode.Forbidden,
        } as ExceptionType);
      }

      let order = await this.orderRepository.getOrderWithRelations(
        orderId,
        trx,
      );

      if (!order || order.userId !== payload.sub) {
        throw new NotFoundException({
          message: {
            engUs: 'order not exist',
            ptBr: 'o pedido não existe',
            esp: 'el orden no existe',
          },
          statusCode: HttpStatusCode.NotFound,
        } as ExceptionType);
      }

      const isPaid = order.status.find(
        (_status_) => _status_.status === 'PAID',
      );

      if (isPaid) {
        throw new NotAcceptableException({
          message: {
            engUs: 'the order already paid',
            ptBr: 'o pedido já foi pago',
            esp: 'la orden de campra ya ha sido pagada',
          },
          statusCode: HttpStatusCode.NotAcceptable,
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
          statusCode: HttpStatusCode.NotAcceptable,
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
          statusCode: HttpStatusCode.NotAcceptable,
        } as ExceptionType);
      }

      if (Date.now() > order.expiresAt?.getTime()) {
        throw new NotAcceptableException({
          message: {
            ptBr: 'o prazo para pagar o pedido expirou, gere um novo pedido.',
            engUs:
              'the deadline to pay for the order has expired, please create a new order.',
            esp: 'El plazo para pagar el pedido ha vencido, generar un nuevo pedido.',
          },
          statusCode: HttpStatusCode.NotAcceptable,
        } as ExceptionType);
      }

      const items = order.OrderItems.map(
        (_item_) =>
          ({
            name: _item_.name,
            price: {
              currencyCode: 'USD',
              unityPrice: parseFloat(_item_.price).toFixed(2),
            },
            quantity: _item_.quantity,
            description: _item_.description,
          }) as Item,
      );

      let orderUpdated: OrderEntity;

      // call payment api
      try {
        if (!order.paymentUrl) {
          const paymentResult = await this.paymentService.createOrderAndPay({
            payment: {
              method: PaymentMethod.CARD,
              provider: PaymentProvider.PayPal,
            },
            customer: {
              name: user.firstName + ' ' + user.lastName,
              email: user.email,
            },
            order: {
              items: items,
              orderId: order.id,
              totalPrice: order.totalPrice,
            },
          });

          const approveLink = paymentResult.links.find(
            (_link_) => _link_.rel === 'payer-action',
          );

          const orderUpdateEntity = Object.assign(order, {
            paymentUrl: approveLink.href,
            paymentId: paymentResult.id,
          } as OrderEntity);

          order = await this.orderRepository.update(
            { id: order.id },
            orderUpdateEntity,
            trx,
          );
        }
      } catch (e) {
        console.log(e);
        throw new InternalServerErrorException();
      }

      const paymentUrl = order.paymentUrl ?? orderUpdated.paymentUrl;

      if (!paymentUrl) {
        throw new NotImplementedException({
          message: {
            engUs: 'payment url not found',
            ptBr: 'url de pagamento não encontrada',
            esp: 'url de pago no encontrada',
          },
          statusCode: HttpStatusCode.NotImplemented,
        } as ExceptionType);
      }

      await trx.commitTransaction();

      return {
        order: { order },
        links: {
          href: paymentUrl,
          method: 'GET',
          rel: 'approve',
          'Content-type': 'text/html',
        },
      };
    } catch (e) {
      await trx.rollbackTransaction();
      throw e;
    } finally {
      await trx.release();
    }
  }

  private calculateToTalPrice(orderItems: OrderItem[]) {
    const total = orderItems
      .reduce(
        (acc, curr) => acc + parseFloat(curr.price) * curr.quantity,
        parseFloat('0.00'),
      )
      .toFixed(2);

    return total;
  }
}
