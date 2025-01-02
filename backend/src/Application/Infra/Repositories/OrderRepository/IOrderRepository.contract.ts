import {
  OrderEntity,
  OrderUniqueRefs,
} from 'src/Application/Entities/Order.entity';
import { IBaseRepositoryContract } from '../IBase.repository-contract';

export type IOrderRepositoryContract = IBaseRepositoryContract<
  OrderEntity,
  unknown,
  OrderUniqueRefs
> & {
  getOrderWithRelations(orderId: string): Promise<OrderEntity>;
  getOrderByUserId(userId: string): Promise<OrderEntity[]>;
};
