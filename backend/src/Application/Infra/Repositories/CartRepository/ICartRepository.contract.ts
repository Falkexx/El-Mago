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

export type ICartRepositoryContract = IBaseRepositoryContract<
  CartEntity,
  CartUpdateEntity,
  CartUniqueRef
> & {
  addCartItem(cartItem: CartItemEntity): Promise<CartItemEntity>;
  updateCartItem(
    cartItemUnqRef: CartUniqueRef,
    updateEntity: UpdateCartItemEntity,
  ): Promise<CartItemEntity>;
};
