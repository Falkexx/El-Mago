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

@Injectable()
export class PutItemInCartUseCase {
  constructor(
    @Inject(KEY_INJECTION.USER_REPOSITORY_CONTRACT)
    private readonly userRepository: IUserRepositoryContract,
    @Inject(KEY_INJECTION.CART_REPOSITORY)
    private readonly cartRepository: ICartRepositoryContract,
    @Inject(KEY_INJECTION.ITEM_REPOSITORY_CONTRACT)
    private readonly itemRepository: IItemRepositoryContract,
  ) {}

  async execute(payload: PayloadType, putDto: PutItemInCartDto) {
    const user = await this.userRepository.getBy({ id: payload.sub });

    if (!user) {
      throw new UnauthorizedException();
    }

    const cart = await this.cartRepository.getBy({ userId: user.id });

    if (!cart) {
      throw new NotFoundException('cart not created');
    }

    const item = await this.itemRepository.getBy({ id: putDto.itemId });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    const itemIsAlreadyInTheCart = cart.items.find(
      (_cartItem_) => _cartItem_.itemId === putDto.itemId,
    );

    if (!itemIsAlreadyInTheCart) {
      // create

      const newCartItem = Object.assign(new CartItemEntity(), {
        id: shortId(15),
        amount: putDto.amount ?? 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        item: item,
        itemId: item.id,
        cart: cart,
      } as CartItemEntity);

      return this.cartRepository.addCartItem(newCartItem);
    }

    // update
    const updateCartItem: UpdateCartItemEntity = {
      amount: putDto.amount
        ? itemIsAlreadyInTheCart.amount + putDto.amount
        : itemIsAlreadyInTheCart.amount + 1,
      updatedAt: new Date(),
    };

    return this.cartRepository.updateCartItem(
      {
        id: itemIsAlreadyInTheCart.id,
      },
      updateCartItem,
    );
  }
}
