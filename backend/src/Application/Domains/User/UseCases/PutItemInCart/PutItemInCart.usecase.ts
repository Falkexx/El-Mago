import { PayloadType } from '#types';
import { shortId } from '#utils';
import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { KEY_INJECTION } from 'src/@metadata/keys';
import {
  CartItemEntity,
  UpdateCartItemEntity,
} from 'src/Application/Entities/Cart/CartItem.entity';
import { ICartRepositoryContract } from 'src/Application/Infra/Repositories/CartRepository/ICartRepository.contract';
import { IUserRepositoryContract } from 'src/Application/Infra/Repositories/UserRepository/IUserRepository.contract';
import { PutItemInCartDto } from './PutItemInCart.dto';
import { IItemRepositoryContract } from 'src/Application/Infra/Repositories/ItemRepository/IItem.repository-contract';
import { DataSource } from 'typeorm';

@Injectable()
export class PutItemInCartUseCase {
  constructor(
    @Inject(KEY_INJECTION.USER_REPOSITORY_CONTRACT)
    private readonly userRepository: IUserRepositoryContract,
    @Inject(KEY_INJECTION.CART_REPOSITORY)
    private readonly cartRepository: ICartRepositoryContract,
    @Inject(KEY_INJECTION.ITEM_REPOSITORY_CONTRACT)
    private readonly itemRepository: IItemRepositoryContract,
    private readonly dataSource: DataSource,
  ) {}

  async execute(payload: PayloadType, putDto: PutItemInCartDto) {
    const trx = this.dataSource.createQueryRunner();

    try {
      await trx.startTransaction();

      const user = await this.userRepository.getBy({ id: payload.sub }, trx);

      if (!user) {
        throw new UnauthorizedException();
      }

      const cart = await this.cartRepository.getBy({ userId: user.id }, trx);

      if (!cart) {
        throw new NotFoundException('cart not created');
      }

      const item = await this.itemRepository.getBy({ id: putDto.itemId }, trx);

      if (!item) {
        throw new NotFoundException('Item not found');
      }

      const itemIsAlreadyInTheCart = cart.items.find(
        (_cartItem_) => _cartItem_.itemId === putDto.itemId,
      );

      if (!itemIsAlreadyInTheCart) {
        // create

        let id: string = shortId(15);
        let existItemWithId = await this.cartRepository.getBy({ id }, trx);

        while (existItemWithId) {
          id = shortId(15);
          existItemWithId = await this.cartRepository.getBy({ id }, trx);
        }

        const cartItemAdded = await this.cartRepository.addCartItem(
          {
            id,
            createdAt: new Date(),
            updatedAt: new Date(),
            item: item,
            quantity: putDto.amount,
            itemId: item.id,
            cart: cart,
            cartId: cart.id,
          },
          trx,
        );

        await trx.commitTransaction();

        return cartItemAdded;
      }

      const cartItemUpdated = await this.cartRepository.updateCartItem(
        {
          id: itemIsAlreadyInTheCart.id,
        },
        {
          quantity: putDto.amount
            ? itemIsAlreadyInTheCart.quantity + putDto.amount
            : itemIsAlreadyInTheCart.quantity + 1,
          updatedAt: new Date(),
        },
        trx,
      );

      await trx.commitTransaction();

      return cartItemUpdated;
    } catch (e) {
      await trx.rollbackTransaction();
      throw e;
    } finally {
      await trx.release();
    }
  }
}
