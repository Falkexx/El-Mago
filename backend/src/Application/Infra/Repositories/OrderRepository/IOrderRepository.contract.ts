import {
  OrderEntity,
  OrderUniqueRefs,
} from 'src/Application/Entities/Order.entity';
import { IBaseRepositoryContract } from '../IBase.repository-contract';
import { OrderStatus } from 'src/Application/Entities/order-status.entity';
import {
  OrderItem,
  OrderItemUniqueRefs,
} from 'src/Application/Entities/order-item.entity';
import { GenericPaginationDto } from 'src/utils/validators';
import { QueryRunner } from 'typeorm';

export type IOrderRepositoryContract = IBaseRepositoryContract<
  OrderEntity,
  Partial<OrderEntity>,
  OrderUniqueRefs
> & {
  getOrderWithRelations(
    orderId: string,
    trx: QueryRunner,
  ): Promise<OrderEntity>;
  getOrderByUserId(userId: string, trx: QueryRunner): Promise<OrderEntity[]>;
  createOrderStatus(
    orderStatus: OrderStatus,
    trx: QueryRunner,
  ): Promise<OrderStatus>;
  getAvailableOrdersToAccept(
    paginationDto: GenericPaginationDto,
    trx: QueryRunner,
  ): Promise<{
    data: OrderEntity[];
    meta: { totalItems: number; page: number; limit: number };
  }>;
  getPendingOrdersFromAffiliate(
    affiliateId: string,
    trx: QueryRunner,
  ): Promise<OrderEntity[]>;
  getOrderItemBy(
    uniqueRef: OrderItemUniqueRefs,
    trx: QueryRunner,
  ): Promise<OrderItem>;
  updateOrderItem(
    orderItemId: string,
    data: Partial<OrderItem>,
    trx: QueryRunner,
  ): Promise<OrderItem>;
  getAvailableOrder(orderId: string, trx: QueryRunner): Promise<OrderEntity>;
  getItemsByOrderId(id: string, trx: QueryRunner): Promise<OrderItem[]>;
};
