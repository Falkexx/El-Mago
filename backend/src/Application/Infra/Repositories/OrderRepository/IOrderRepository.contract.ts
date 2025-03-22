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

export type IOrderRepositoryContract = IBaseRepositoryContract<
  OrderEntity,
  Partial<OrderEntity>,
  OrderUniqueRefs
> & {
  getOrderWithRelations(orderId: string): Promise<OrderEntity>;
  getOrderByUserId(userId: string): Promise<OrderEntity[]>;
  createOrderStatus(orderStatus: OrderStatus): Promise<OrderEntity>;
  getAvailableOrdersToAccept(): Promise<OrderEntity[]>;
  getPendingOrdersFromAffiliate(affiliateId: string): Promise<OrderEntity>;
  getOrderItemBy(uniqueRef: OrderItemUniqueRefs): Promise<OrderItem>;
  updateOrderItem(
    orderItemId: string,
    data: Partial<OrderItem>,
  ): Promise<OrderItem>;
  getAvailableOrder(orderId: string): Promise<OrderEntity>;
};
