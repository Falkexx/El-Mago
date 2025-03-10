import {
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { KEY_INJECTION } from 'src/@metadata/keys';
import { ICartRepositoryContract } from 'src/Application/Infra/Repositories/CartRepository/ICartRepository.contract';
import { PayloadType } from '#types';
import { IUserRepositoryContract } from 'src/Application/Infra/Repositories/UserRepository/IUserRepository.contract';
import { OrderEntity } from 'src/Application/Entities/Order.entity';
import { shortId } from '#utils';
import { OrderStatus } from 'src/Application/Entities/order-status.entity';
import { CartEntity } from 'src/Application/Entities/Cart/Cart.entity';
import { DataSource, Table } from 'typeorm';
import { UserEntity } from 'src/Application/Entities/User.entity';
import { ItemEntity } from 'src/Application/Entities/Item.entity';
import { OrderItem } from 'src/Application/Entities/order-item.entity';
import { IItemRepositoryContract } from 'src/Application/Infra/Repositories/ItemRepository/IItem.repository-contract';
import { CartItemEntity } from 'src/Application/Entities/Cart/CartItem.entity';
import { Status } from 'src/@metadata';
import { CreateOrderDto } from './CreateOrder.dto';
import { TABLE } from 'src/@metadata/tables';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject(KEY_INJECTION.USER_REPOSITORY_CONTRACT)
    private readonly userRepository: IUserRepositoryContract,
    @Inject(KEY_INJECTION.CART_REPOSITORY)
    private readonly cartRepository: ICartRepositoryContract,
    @Inject(KEY_INJECTION.ITEM_REPOSITORY_CONTRACT)
    private readonly itemRepository: IItemRepositoryContract,

    private readonly dataSource: DataSource,
  ) {}

  async execute(payload: PayloadType, createOrderDto: CreateOrderDto) {
    const user = await this.userRepository.getBy({ id: payload.sub });

    if (!user) {
      throw new UnauthorizedException();
    }

    const cart = await this.cartRepository.getBy({ userId: user.id });

    if (!cart) {
      throw new NotFoundException('cart not created');
    }

    const itemsIds = cart.items.map((_item_) => _item_.itemId);
    console.log(itemsIds);

    if (itemsIds.length <= 0) {
      throw new NotAcceptableException('no have items in cart');
    }

    const items = await this.itemRepository.getManyByIds(itemsIds);

    // if (cart.items.length <= 0) {
    //   throw new NotAcceptableException('no have items in card');
    // }

    return this.createOrderTransaction(user, cart, items, createOrderDto);
  }

  private async createOrderTransaction(
    user: UserEntity,
    cart: CartEntity,
    items: ItemEntity[],
    createOrderDto: CreateOrderDto,
  ) {
    return await this.dataSource.transaction(async (manager) => {
      const itemsEntityList = items.map((_item_) => {
        return Object.assign(new OrderItem(), {
          id: shortId(20),
          currency: 'USD',
          Item: _item_,
          price: _item_.price.toString(),
          itemId: _item_.id,
          name: _item_.name,
          description: '  ',
        });
      });

      const status = Object.assign(new OrderStatus(), {
        id: shortId(10),
        createdAt: new Date(),
        status: Status.CREATED,
        title: 'Aguardando o pagamento',
        description: null,
      } as OrderStatus);

      const order = Object.assign(new OrderEntity(), {
        id: shortId(10),
        coupon: ' ',
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'Compra dos items...',
        userId: user.id,
        status: [status],
        OrderItems: itemsEntityList,
        battleTag: createOrderDto.battleTag,
        nickName: createOrderDto.nickName,
        platform: createOrderDto.platform ?? null,
      } as OrderEntity);

      await manager.save(order.OrderItems);

      await manager.save(order.status);

      const orderEntity = manager.create(OrderEntity, order);

      const savedOrder = await manager.save(OrderEntity, orderEntity);

      await manager.delete(CartItemEntity, { cart: { id: cart.id } });

      return savedOrder;
    });
  }
}
