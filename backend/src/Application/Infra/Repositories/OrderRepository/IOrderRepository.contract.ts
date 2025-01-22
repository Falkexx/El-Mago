import {
  OrderEntity,
  OrderUniqueRefs,
} from 'src/Application/Entities/Order.entity';
import { IBaseRepositoryContract } from '../IBase.repository-contract';
import { OrderStatus } from 'src/Application/Entities/order-status.entity';

export type IOrderRepositoryContract = IBaseRepositoryContract<
  OrderEntity,
  Partial<OrderEntity>,
  OrderUniqueRefs
> & {
  getOrderWithRelations(orderId: string): Promise<OrderEntity>;
  getOrderByUserId(userId: string): Promise<OrderEntity[]>;
  createOrderStatus(orderStatus: OrderStatus): Promise<OrderEntity>;
  getorOrdersWithOutffiliate(): Promise<OrderEntity[]>;
};
