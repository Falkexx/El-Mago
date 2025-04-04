import {
  OrderEntity,
  OrderUniqueRefs,
} from 'src/Application/Entities/Order.entity';
import { DataSource, Not, Repository, Table } from 'typeorm';
import { IOrderRepositoryContract } from './IOrderRepository.contract';
import { PaginationResult } from '#types';
import { GenericPaginationDto } from 'src/utils/validators';
import { splitKeyAndValue } from '#utils';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SearchBuilderService } from '../SearchBuilder.service';
import { TABLE } from 'src/@metadata/tables';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderStatus } from 'src/Application/Entities/order-status.entity';
import {
  OrderItem,
  OrderItemUniqueRefs,
} from 'src/Application/Entities/order-item.entity';
import { table } from 'node:console';
import { Status } from 'src/@metadata';
import { ItemEntity } from 'src/Application/Entities/Item.entity';

export class OrderTypeOrmRepository implements IOrderRepositoryContract {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderStatus)
    private readonly orderStatusRepository: Repository<OrderStatus>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly dataSource: DataSource,
    private readonly searchBuilderService: SearchBuilderService,
  ) {}

  create(entity: OrderEntity): Promise<OrderEntity> {
    throw new Error('Method not implemented.');
  }

  async getBy(unqRef: OrderUniqueRefs): Promise<OrderEntity> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      return (await this.orderRepository.findOneBy({ [key]: value })) ?? null;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async getOrderWithRelations(orderId: string): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: {
        status: true,
      },
    });

    return order;
  }

  async update(
    unqRef: OrderUniqueRefs,
    updateEntity: Partial<OrderEntity>,
  ): Promise<OrderEntity> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const orderToUpdate = await this.orderRepository.findOne({
        where: { [key]: value },
      });

      if (!orderToUpdate) {
        throw new NotFoundException('order not found');
      }

      const newOrder = Object.assign(orderToUpdate, updateEntity);

      return await this.orderRepository.save(newOrder);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async delete(unqRef: OrderUniqueRefs): Promise<void> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      await this.orderRepository.delete({ [key]: value });
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  softDelete(unqRef: OrderUniqueRefs): Promise<'success' | 'fail'> {
    try {
      throw new Error('Method not implemented.');
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async getAll(): Promise<OrderEntity[]> {
    try {
      return await this.orderRepository.find();
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async getWithPaginationAndFilters<R extends keyof OrderEntity>(
    paginationDto: GenericPaginationDto,
  ): Promise<PaginationResult<OrderEntity[]>> {
    try {
      const queryBuilder = this.orderRepository.createQueryBuilder(TABLE.order);

      return this.searchBuilderService.search(
        paginationDto,
        TABLE.order,
        queryBuilder,
        {
          searchField: 'name',
          createdField: 'createdAt',
        },
      );
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async getOrderByUserId(userId: string): Promise<OrderEntity[]> {
    return this.orderRepository.find({ where: { userId: userId } });
  }

  async createOrderStatus(orderStatus: OrderStatus): Promise<OrderEntity> {
    try {
      const queryBuilder = this.orderStatusRepository.createQueryBuilder();

      return (
        await queryBuilder
          .insert()
          .into(OrderStatus)
          .values(orderStatus)
          .returning('*')
          .execute()
      ).raw[0];
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async getAvailableOrdersToAccept(
    paginationDto: GenericPaginationDto,
  ): Promise<{
    data: OrderEntity[];
    meta: { totalItems: number; page: number; limit: number };
  }> {
    const { limit, page } = paginationDto;
    const offset = (page - 1) * limit;
    try {
      const orders = await this.orderItemRepository.query(
        `
        SELECT
          o."id",  
          o."name",
          o."createdAt",
          o."updatedAt",
          o."affiliateId",
          json_agg(
            json_build_object(
              'name', oi."name",
              'currency', oi."currency",
              'itemId', oi."itemId",
              'orderId', oi."orderId",
              'price', oi."price",
              'quantity', oi."quantity"
            )
          ) AS items,
          json_agg(
            json_build_object(
              'id', os."id",
              'title', os."title",
              'status', os."status",
              'createdAt', os."createdAt"              
            )
          ) AS status        
        FROM
          "${TABLE.order}" o
          LEFT JOIN
          "${TABLE.order_status}" os ON os."orderId" = o."id"
          LEFT JOIN
          ${TABLE.order_item} oi ON oi."orderId" = o.id
          WHERE
          o."digitalShippingId" IS NULL
          AND o."affiliateId" IS NULL
          AND os."status" = '${Status.PAID}'
          GROUP BY
          o.id
        ORDER BY o."createdAt" ASC
        LIMIT $1
        OFFSET $2
      `,
        [limit, offset],
      );

      const [totalAvailableOrders] = await this.orderItemRepository.query(`
        SELECT COUNT(id) FROM "order" WHERE "affiliateId" IS NULL;
      `);

      return {
        data: orders,
        meta: {
          limit,
          page,
          totalItems: Number(totalAvailableOrders.count),
        },
      };
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getPendingOrdersFromAffiliate(
    affiliateId: string,
  ): Promise<OrderEntity> {
    const result = await this.dataSource.query(
      `SELECT * FROM "${TABLE.digital_shipping}" WHERE "affiliateId" = $1 AND "finishedAt" IS NOT NULL`,
      [affiliateId],
    );

    return result;
  }

  async updateOrderItem(
    orderItemId: string,
    data: Partial<OrderItem>,
  ): Promise<OrderItem> {
    const queryBuilder = this.orderItemRepository.createQueryBuilder();

    try {
      const result = await queryBuilder
        .update(OrderItem)
        .set({ ...data })
        .where('id = :id', {
          id: orderItemId,
        })
        .returning('*')
        .execute();

      return result.raw[0];
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async getOrderItemBy(uniqueRef: OrderItemUniqueRefs): Promise<OrderItem> {
    const queryBuilder = this.orderItemRepository.createQueryBuilder();
    const [key, value] = splitKeyAndValue(uniqueRef);

    try {
      const result = await queryBuilder
        .select('*')
        .from(OrderItem, TABLE.order_item)
        .where(`${key} = :${key}`, {
          [key]: value,
        })
        .getOne();

      return result;
    } catch (e) {}
  }

  async getAvailableOrder(orderId: string): Promise<OrderEntity> {
    try {
      const orderQuery = `
        SELECT DISTINCT o.*
        FROM "${TABLE.order}" o
        INNER JOIN "${TABLE.order_status}" os1 on os1."orderId" = o."id" and os1."status" = '${Status.CREATED}'
        INNER JOIN "${TABLE.order_status}" os2 on os2."orderId" = o."id" and os2."status" = '${
          Status.PAID
        }'
        WHERE  o."id" = $1
        AND NOT exists (
          SELECT 1
          FROM "${TABLE.order_status}" os_excl
          WHERE os_excl."orderId" = o.id
          AND os_excl."status" in ('${Status.ACCEPT}', '${Status.CANCELED}')
        )
      `;

      const [order] = await this.orderRepository.query(orderQuery, [orderId]);

      return order;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
  async getItemsByOrderId(id: string): Promise<ItemEntity[]> {
    const items = await this.orderItemRepository.query(
      `
      SELECT * FROM "${TABLE.order_item}" WHERE "orderId" = $1
    `,
      [id],
    );

    return items;
  }
}
