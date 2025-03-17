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
    return await this.dataSource.transaction(async (manager) => {
      // Busca o usuário
      const user = await this.userRepository.getBy({ id: payload.sub });
      if (!user) {
        throw new UnauthorizedException();
      }

      // Busca o carrinho
      const cart = await this.cartRepository.getBy({ userId: user.id });
      if (!cart) {
        throw new NotFoundException('cart not created');
      }

      // Verifica se há itens no carrinho
      const itemsIds = cart.items.map((item) => item.itemId);
      if (itemsIds.length <= 0) {
        throw new NotAcceptableException('no items in cart');
      }

      // Busca os itens
      const items = await this.itemRepository.getManyByIds(itemsIds);
      if (!items || items.length <= 0) {
        throw new NotAcceptableException('no items in cart');
      }

      // Cria a entidade de pedido
      const order = manager.create(OrderEntity, {
        id: shortId(10),
        coupon: ' ',
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'Compra dos itens...',
        userId: user.id,
        battleTag: createOrderDto.battleTag,
        nickName: createOrderDto.nickName,
        platform: createOrderDto.platform ?? null,
        completedAt: null,
        digitalShippingId: null,
        paymentId: null,
        paymentUrl: null,
        DigitalShipping: null,
        user,
      });

      const orderCreated = (
        await manager
          .createQueryBuilder()
          .insert()
          .into(OrderEntity)
          .values(order)
          .returning('*') // Retorna todos os campos após a inserção
          .execute()
      ).raw;

      // Cria os itens do pedido
      const itemsEntityList = items.map((item) => {
        const quantity = cart.items.find(
          (_cart_item_) => _cart_item_.itemId === item.id,
        ).quantity;
        return manager.create(OrderItem, {
          id: shortId(20),
          currency: 'USD',
          Item: item,
          price: item.price.toString(),
          itemId: item.id,
          name: item.name,
          description: '  ',
          imageUrl: '',
          orderId: order.id,
          price_per_unit: item.price.toString(),
          quantity: quantity,
          Order: order,
        } as OrderItem);
      });

      // Salva os itens do pedido
      await manager.save(OrderItem, itemsEntityList);

      // Cria o status do pedido
      const status = manager.create(OrderStatus, {
        id: shortId(10),
        createdAt: new Date(),
        status: Status.CREATED,
        title: 'Aguardando o pagamento',
        description: null,
        orderId: order.id, // Relaciona o status ao pedido
        Order: order, // Relaciona explicitamente a entidade Order
        order: order,
      } as OrderStatus);

      // Salva o status
      await manager.save(OrderStatus, status);

      // // Remove os itens do carrinho
      await manager.delete(CartItemEntity, { cart: { id: cart.id } });

      return orderCreated;
    });
  }
}
