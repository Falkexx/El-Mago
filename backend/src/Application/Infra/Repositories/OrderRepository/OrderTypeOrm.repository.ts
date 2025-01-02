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
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SearchBuilderService } from '../SearchBuilder.service';
import { TABLE } from 'src/@metadata/tables';
import { InjectRepository } from '@nestjs/typeorm';

export class OrderTypeOrmRepository implements IOrderRepositoryContract {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
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
    updateEntity: unknown,
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
}
