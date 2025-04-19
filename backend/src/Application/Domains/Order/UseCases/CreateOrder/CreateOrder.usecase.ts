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
import { shortId } from '#utils';
import { OrderStatus } from 'src/Application/Entities/order-status.entity';
import { DataSource, Table } from 'typeorm';
import { OrderItem } from 'src/Application/Entities/order-item.entity';
import { IItemRepositoryContract } from 'src/Application/Infra/Repositories/ItemRepository/IItem.repository-contract';
import { Status } from 'src/@metadata';
import { CreateOrderDto } from './CreateOrder.dto';
import { IOrderRepositoryContract } from 'src/Application/Infra/Repositories/OrderRepository/IOrderRepository.contract';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject(KEY_INJECTION.USER_REPOSITORY_CONTRACT)
    private readonly userRepository: IUserRepositoryContract,
    @Inject(KEY_INJECTION.CART_REPOSITORY)
    private readonly cartRepository: ICartRepositoryContract,
    @Inject(KEY_INJECTION.ITEM_REPOSITORY_CONTRACT)
    private readonly itemRepository: IItemRepositoryContract,
    @Inject(KEY_INJECTION.ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepositoryContract,
    private readonly dataSource: DataSource,
  ) {}

  async execute(payload: PayloadType, createOrderDto: CreateOrderDto) {
    const trx = this.dataSource.createQueryRunner();

    try {
      await trx.startTransaction();
      // Busca o usuário
      const user = await this.userRepository.getBy({ id: payload.sub }, trx);
      if (!user) {
        throw new UnauthorizedException();
      }

      // Busca o carrinho
      const cart = await this.cartRepository.getBy({ userId: user.id }, trx);

      if (!cart) {
        throw new NotFoundException('cart not created');
      }

      // Verifica se há itens no carrinho
      const itemsIds = cart.items.map((item) => item.itemId);
      if (itemsIds.length <= 0) {
        throw new NotAcceptableException('no items in cart');
      }

      // Busca os itens
      const items = await this.itemRepository.getManyByIds(itemsIds, trx);

      console.log(items);
      if (!items || items.length <= 0) {
        throw new NotAcceptableException({
          ptBr: 'não ha itens no carrinho',
          enUs: 'no have itens in cart',
          esp: 'no hay artículos en el carrito',
        });
      }

      const totalPrice = parseFloat(
        items
          .reduce((acc, curr) => {
            const itemInCard = cart.items.find(
              (cartItem) => cartItem.itemId === curr.id,
            );

            return acc + parseFloat(curr.price) * itemInCard.quantity;
          }, 0)
          .toString(),
      ).toFixed(2);

      const names = items.map((item) => item.name);

      const now = new Date();

      const expiresAt: Date = new Date(now.setHours(now.getHours() + 3 * 24)); // expires in 3 days

      //Cria a entidade de pedido
      const orderCreated = await this.orderRepository.create(
        {
          id: shortId(20),
          name: `Compra dos itens: ${names.join(', ')}`,
          coupon: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: user.id,
          battleTag: createOrderDto.battleTag,
          nickName: createOrderDto.nickName,
          platform: createOrderDto.platform ?? null,
          totalPrice: totalPrice,
          completedAt: null,
          paymentId: null,
          paymentUrl: null,
          proofOfDelivery: null,
          Affiliate: null,
          affiliateId: null,
          expiresAt,
          user,
          OrderItems: undefined,
          status: undefined,
        },
        trx,
      );

      // Cria os itens do pedido
      items.map((item) => {
        const quantity = cart.items.find(
          (_cart_item_) => _cart_item_.itemId === item.id,
        ).quantity;

        return this.orderRepository.createOrderItem(
          {
            id: shortId(20),
            currency: 'USD',
            Item: item,
            price: item.price.toString(),
            itemId: item.id,
            name: item.name,
            description: '  ',
            imageUrl: '',
            price_per_unit: item.price,
            quantity: quantity,
            Order: orderCreated,
            orderId: orderCreated.id,
            proofOfDelivery: null,
          } as OrderItem,
          trx,
        );
      });

      // Cria o status do pedido
      const status = await this.orderRepository.createOrderStatus(
        {
          id: shortId(10),
          createdAt: new Date(),
          status: Status.CREATED,
          title: 'Aguardando o pagamento',
          description: null,
          orderId: orderCreated.id, // Relaciona o status ao pedido
          order: orderCreated,
        } as OrderStatus,
        trx,
      );

      // Remove os itens do carrinho
      await this.cartRepository.release(cart.id, trx);

      await trx.commitTransaction();

      return orderCreated;
    } catch (e) {
      await trx.rollbackTransaction();
      throw e;
    } finally {
      await trx.release();
    }
  }
}
