import {
  OrderEntity,
  OrderUniqueRefs,
} from 'src/Application/Entities/Order.entity';
import { DataSource, Repository } from 'typeorm';
import { IOrderRepositoryContract } from './IOrderRepository.contract';
import { PaginationResult } from '#types';
import { GenericPaginationDto } from 'src/utils/validators';
import { splitKeyAndValue } from '#utils';
import {
  Injectable,
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
import { Status } from 'src/@metadata';
import { QueryRunner } from 'typeorm';

@Injectable()
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

  async create(entity: OrderEntity, trx: QueryRunner): Promise<OrderEntity> {
    try {
      const result = await trx.manager
        .createQueryBuilder()
        .insert()
        .into(OrderEntity)
        .values(entity)
        .returning('*')
        .execute();

      return result.raw[0];
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getBy(unqRef: OrderUniqueRefs, trx: QueryRunner): Promise<OrderEntity> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const result = await trx.manager
        .createQueryBuilder()
        .select('*')
        .from(OrderEntity, TABLE.order)
        .where(`"${TABLE.order}"."${key}" = :${key}`, { [key]: value })
        .getOne();

      return result ?? null;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getOrderWithRelations(
    orderId: string,
    trx: QueryRunner,
  ): Promise<OrderEntity> {
    try {
      const result = await trx.manager
        .createQueryBuilder(OrderEntity, 'order')
        .leftJoinAndSelect('order.status', 'status')
        .where(`order.id = :id`, { id: orderId })
        .getOne();

      return result ?? null;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async update(
    unqRef: OrderUniqueRefs,
    updateEntity: Partial<OrderEntity>,
    trx: QueryRunner,
  ): Promise<OrderEntity> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const result = await trx.manager
        .createQueryBuilder()
        .update(OrderEntity)
        .set(updateEntity)
        .where(`"${TABLE.order}"."${key}" = :${key}`, { [key]: value })
        .returning('*')
        .execute();

      if (result.affected === 0) {
        throw new NotFoundException('order not found');
      }

      return result.raw[0];
    } catch (e) {
      console.error(e);
      if (e instanceof NotFoundException) throw e;
      throw new InternalServerErrorException();
    }
  }

  async delete(unqRef: OrderUniqueRefs, trx: QueryRunner): Promise<void> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const result = await trx.manager
        .createQueryBuilder()
        .delete()
        .from(OrderEntity, TABLE.order)
        .where(`"${TABLE.order}"."${key}" = :${key}`, { [key]: value })
        .execute();

      if (result.affected === 0) {
        throw new NotFoundException('order not found');
      }
    } catch (e) {
      console.error(e);
      if (e instanceof NotFoundException) throw e;
      throw new InternalServerErrorException();
    }
  }

  async softDelete(
    unqRef: OrderUniqueRefs,
    trx: QueryRunner,
  ): Promise<OrderEntity> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const result = await trx.manager
        .createQueryBuilder()
        .update(OrderEntity)
        .set({ deletedAt: new Date() })
        .where(`"${TABLE.order}"."${key}" = :${key}`, { [key]: value })
        .andWhere(`"${TABLE.order}"."deletedAt" IS NULL`)
        .returning('*')
        .execute();

      if (result.affected === 0) {
        throw new NotFoundException('order not found');
      }

      return result.raw[0];
    } catch (e) {
      console.error(e);
      if (e instanceof NotFoundException) throw e;
      throw new InternalServerErrorException();
    }
  }

  async getAll(trx: QueryRunner): Promise<OrderEntity[]> {
    try {
      const result = await trx.manager
        .createQueryBuilder()
        .select('*')
        .from(OrderEntity, TABLE.order)
        .where(`"${TABLE.order}"."deletedAt" IS NULL`)
        .getMany();

      return result;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getWithPaginationAndFilters(
    paginationDto: GenericPaginationDto,
    trx: QueryRunner,
  ): Promise<PaginationResult<OrderEntity[]>> {
    try {
      const queryBuilder = trx.manager.createQueryBuilder(
        OrderEntity,
        TABLE.order,
      );

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
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getOrderByUserId(
    userId: string,
    trx: QueryRunner,
  ): Promise<OrderEntity[]> {
    try {
      const result = await trx.manager
        .createQueryBuilder()
        .select('*')
        .from(OrderEntity, TABLE.order)
        .where(`"${TABLE.order}"."userId" = :userId`, { userId })
        .getMany();

      return result;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async createOrderStatus(
    orderStatus: OrderStatus,
    trx: QueryRunner,
  ): Promise<OrderStatus> {
    try {
      const result = await trx.manager
        .createQueryBuilder()
        .insert()
        .into(OrderStatus)
        .values(orderStatus)
        .returning('*')
        .execute();

      return result.raw[0];
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getAvailableOrdersToAccept(
    paginationDto: GenericPaginationDto,
    trx: QueryRunner,
  ): Promise<{
    data: OrderEntity[];
    meta: { totalItems: number; page: number; limit: number };
  }> {
    const { limit, page } = paginationDto;
    const offset = (page - 1) * limit;

    try {
      const orders = await trx.manager.query(
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
          "${TABLE.order_item}" oi ON oi."orderId" = o."id"
          WHERE
          o."proofOfDelivery" IS NULL
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

      const [totalAvailableOrders] = await trx.manager.query(`
        SELECT COUNT(id) FROM "${TABLE.order}" WHERE "affiliateId" IS NULL;
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
    trx: QueryRunner,
  ): Promise<OrderEntity[]> {
    try {
      const result = await trx.manager.query(
        `
       SELECT 
          o."id",
          o."name",
          o."totalPrice",
          o."createdAt",
          o."updatedAt",
          o."nickName",
          (
            SELECT jsonb_agg(
              json_build_object(
                'id', s."id",
                'status', s."status",
                'createdAt', s."createdAt"
              )
            )
            FROM "${TABLE.order_status}" s
            WHERE s."orderId" = o."id"
          ) AS status
       FROM "${TABLE.order}" o
       WHERE o."affiliateId" = $1
      `,
        [affiliateId],
      );

      return result;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async updateOrderItem(
    orderItemId: string,
    data: Partial<OrderItem>,
    trx: QueryRunner,
  ): Promise<OrderItem> {
    try {
      const result = await trx.manager
        .createQueryBuilder()
        .update(OrderItem)
        .set(data)
        .where(`"${TABLE.order_item}"."id" = :id`, { id: orderItemId })
        .returning('*')
        .execute();

      if (result.affected === 0) {
        throw new NotFoundException('order item not found');
      }

      return result.raw[0];
    } catch (e) {
      console.error(e);
      if (e instanceof NotFoundException) throw e;
      throw new InternalServerErrorException();
    }
  }

  async getOrderItemBy(
    uniqueRef: OrderItemUniqueRefs,
    trx: QueryRunner,
  ): Promise<OrderItem> {
    const [key, value] = splitKeyAndValue(uniqueRef);

    try {
      const result = await trx.manager
        .createQueryBuilder()
        .select('*')
        .from(OrderItem, TABLE.order_item)
        .where(`"${TABLE.order_item}"."${key}" = :${key}`, { [key]: value })
        .getOne();

      return result ?? null;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getAvailableOrder(
    orderId: string,
    trx: QueryRunner,
  ): Promise<OrderEntity> {
    try {
      const result = await trx.manager.query(
        `
        SELECT DISTINCT o.*
        FROM "${TABLE.order}" o
        INNER JOIN "${TABLE.order_status}" os1 ON os1."orderId" = o."id" AND os1."status" = '${Status.CREATED}'
        INNER JOIN "${TABLE.order_status}" os2 ON os2."orderId" = o."id" AND os2."status" = '${Status.PAID}'
        WHERE o."id" = $1
        AND NOT EXISTS (
          SELECT 1
          FROM "${TABLE.order_status}" os_excl
          WHERE os_excl."orderId" = o."id"
          AND os_excl."status" IN ('${Status.ACCEPT}', '${Status.CANCELED}')
        )
      `,
        [orderId],
      );

      return result[0] ?? null;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getItemsByOrderId(id: string, trx: QueryRunner): Promise<OrderItem[]> {
    try {
      const result = await trx.manager
        .createQueryBuilder()
        .select('*')
        .from(OrderItem, TABLE.order_item)
        .where(`"${TABLE.order_item}"."orderId" = :id`, { id })
        .getMany();

      return result;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }
}
