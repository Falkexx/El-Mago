import {
  CartEntity,
  CartUniqueRef,
  CartUpdateEntity,
} from 'src/Application/Entities/Cart/Cart.entity';
import { IBaseRepositoryContract } from '../IBase.repository-contract';
import {
  CartItemEntity,
  UpdateCartItemEntity,
} from 'src/Application/Entities/Cart/CartItem.entity';
import { QueryRunner } from 'typeorm';

export type ICartRepositoryContract = IBaseRepositoryContract<
  CartEntity,
  CartUpdateEntity,
  CartUniqueRef
> & {
  addCartItem(
    cartItem: CartItemEntity,
    trx: QueryRunner,
  ): Promise<CartItemEntity>;
  updateCartItem(
    cartItemUnqRef: CartUniqueRef,
    updateEntity: UpdateCartItemEntity,
    trx: QueryRunner,
  ): Promise<CartItemEntity>;
  release(cartId: string, trx: QueryRunner): Promise<void>;
};
