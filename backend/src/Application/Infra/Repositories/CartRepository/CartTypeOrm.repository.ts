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
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { splitKeyAndValue } from '#utils';

export class CartTypeOrmRepository implements ICartRepositoryContract {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
  ) {}

  create(entity: CartEntity): Promise<CartEntity> {
    try {
      const cartEntity = this.cartRepository.create(entity);

      return this.cartRepository.save(cartEntity);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('internal server error');
    }
  }

  async getBy(unqRef: CartUniqueRef): Promise<CartEntity> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const cart = await this.cartRepository.findOne({ [key]: value });

      return cart ?? null;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('internal server error');
    }
  }

  async update(
    unqRef: CartUniqueRef,
    updateEntity: CartUpdateEntity,
  ): Promise<CartEntity> {
    try {
      const [key, value] = splitKeyAndValue(unqRef);

      const cartToUpdate = await this.cartRepository.findOne({
        where: { [key]: value },
      });

      if (!cartToUpdate) {
        throw new NotFoundException('cart not found');
      }

      const newCart = Object.assign(cartToUpdate, updateEntity);

      return this.cartRepository.save(newCart);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('internal server error');
    }
  }

  async delete(unqRef: CartUniqueRef): Promise<void> {
    try {
      const [key, value] = splitKeyAndValue(unqRef);

      await this.cartRepository.delete({ [key]: value });
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('internal server error');
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  softDelete(unqRef: CartUniqueRef): Promise<'success' | 'fail'> {
    throw new Error('Method no implemented');
  }

  getAll(): Promise<CartEntity[]> {
    try {
      return this.cartRepository.find();
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('internal server error');
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getWithPaginationAndFilters<R extends keyof CartEntity>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    paginationDto: GenericPaginationDto,
  ): Promise<PaginationResult<CartEntity[]>> {
    try {
      throw new Error('Method not implemented');
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('internal server error');
    }
  }
}
