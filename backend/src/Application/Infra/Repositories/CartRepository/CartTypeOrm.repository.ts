import { PaginationResult } from '#types';
import {
  CartEntity,
  CartUniqueRef,
  CartUpdateEntity,
} from 'src/Application/Entities/Cart/Cart.entity';
import { GenericPaginationDto } from 'src/utils/validators';
import { ICartRepositoryContract } from './ICartRepository.contract';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { splitKeyAndValue } from '#utils';
import {
  CartItemEntity,
  UpdateCartItemEntity,
} from 'src/Application/Entities/Cart/CartItem.entity';
import { TABLE } from 'src/@metadata/tables';

export class CartTypeOrmRepository implements ICartRepositoryContract {
  constructor() {}

  async create(entity: CartEntity, trx: QueryRunner): Promise<CartEntity> {
    try {
      const result = await trx.manager
        .createQueryBuilder()
        .insert()
        .into(CartEntity)
        .values(entity)
        .returning('*')
        .execute();

      return result.raw[0];
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('internal server error');
    }
  }

  async getBy(
    unqRef: CartUniqueRef,
    trx: QueryRunner,
  ): Promise<CartEntity | null> {
    try {
      const [key, value] = splitKeyAndValue(unqRef);

      const cart = await trx.manager
        .createQueryBuilder(CartEntity, 'cart')
        .leftJoinAndSelect('cart.items', 'items')
        .where(`"${TABLE.cart}"."${key}" = :value`, { value })
        .andWhere(`"${TABLE.cart}"."deletedAt" IS NULL`)
        .getOne();

      return cart ?? null;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('internal server error');
    }
  }

  async update(
    unqRef: CartUniqueRef,
    updateEntity: CartUpdateEntity,
    trx: QueryRunner,
  ): Promise<CartEntity> {
    try {
      const [key, value] = splitKeyAndValue(unqRef);

      const result = await trx.manager
        .createQueryBuilder()
        .update(CartEntity)
        .set(updateEntity)
        .where(`"${TABLE.cart}"."${key}" = :value`, { value })
        .andWhere(`"${TABLE.cart}"."deletedAt" IS NULL`)
        .returning('*')
        .execute();

      if (!result.raw[0]) {
        throw new NotFoundException('cart not found');
      }

      return result.raw[0];
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('internal server error');
    }
  }

  async delete(unqRef: CartUniqueRef, trx: QueryRunner): Promise<void> {
    try {
      const [key, value] = splitKeyAndValue(unqRef);

      const result = await trx.manager
        .createQueryBuilder()
        .delete()
        .from(CartEntity)
        .where(`"${TABLE.cart}"."${key}" = :value`, { value })
        .andWhere(`"${TABLE.cart}"."deletedAt" IS NULL`)
        .execute();

      if (result.affected === 0) {
        throw new NotFoundException('cart not found');
      }
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('internal server error');
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  softDelete(unqRef: CartUniqueRef, trx: QueryRunner): Promise<CartEntity> {
    throw new Error('Method no implemented');
  }

  async getAll(trx: QueryRunner): Promise<CartEntity[]> {
    try {
      return await trx.manager
        .createQueryBuilder(CartEntity, 'cart')
        .where(`"${TABLE.cart}"."deletedAt" IS NULL`)
        .getMany();
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('internal server error');
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getWithPaginationAndFilters<R extends keyof CartEntity>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    paginationDto: GenericPaginationDto,
    trx: QueryRunner,
  ): Promise<PaginationResult<CartEntity[]>> {
    try {
      throw new Error('Method not implemented');
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('internal server error');
    }
  }

  async addCartItem(
    cartItem: CartItemEntity,
    trx: QueryRunner,
  ): Promise<CartItemEntity> {
    try {
      const result = await trx.manager
        .createQueryBuilder()
        .insert()
        .into(CartItemEntity)
        .values(cartItem)
        .returning('*')
        .execute();

      return result.raw[0];
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('internal server error');
    }
  }

  async updateCartItem(
    cartItemUnqRef: CartUniqueRef,
    cartUpdate: UpdateCartItemEntity,
    trx: QueryRunner,
  ): Promise<CartItemEntity> {
    try {
      const [key, value] = splitKeyAndValue(cartItemUnqRef);

      const result = await trx.manager
        .createQueryBuilder()
        .update(CartItemEntity)
        .set(cartUpdate)
        .where(`"${TABLE.cart_item}"."${key}" = :value`, { value })
        .returning('*')
        .execute();

      if (!result.raw[0]) {
        throw new NotFoundException('Cart item not found');
      }

      return result.raw[0];
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async release(unqRef: CartUniqueRef, trx: QueryRunner): Promise<void> {
    try {
      const [key, value] = splitKeyAndValue(unqRef);

      await trx.manager
        .createQueryBuilder()
        .delete()
        .from(CartItemEntity, TABLE.cart_item)
        .where(`${TABLE.cart_item}."${key}" = :value`, { value })
        .andWhere(`${TABLE.cart_item}."deletedAt" IS NULL`)
        .execute();
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }
}
