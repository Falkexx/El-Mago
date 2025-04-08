import {
  TransactionEntity,
  TransactionUniqueRefs,
} from 'src/Application/Entities/Transactions.entity';
import { GenericPaginationDto } from 'src/utils/validators';
import { QueryRunner } from 'typeorm';
import { ITransactionRepositoryContract } from './ITransaction.repository-contract';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { splitKeyAndValue } from '#utils';
import { PaginationResult } from '#types';

@Injectable()
export class TransactionTypeOrmRepository
  implements ITransactionRepositoryContract
{
  create(
    entity: TransactionEntity,
    trx?: QueryRunner,
  ): Promise<TransactionEntity> {
    try {
      return trx.manager
        .createQueryBuilder()
        .insert()
        .into(TransactionEntity)
        .values(entity)
        .returning('*')
        .execute()
        .then((result) => result.raw[0]);
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  getBy(
    unqRef: TransactionUniqueRefs,
    trx?: QueryRunner,
  ): Promise<TransactionEntity> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      return trx.manager
        .createQueryBuilder()
        .select()
        .from(TransactionEntity, 'transaction')
        .where(`"${key}" = :value`, { value })
        .andWhere(`"deletedAt" IS NULL`)
        .execute()
        .then((result) => result.raw[0]);
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async update(
    unqRef: TransactionUniqueRefs,
    updateEntity: Partial<TransactionEntity>,
    trx?: QueryRunner,
  ): Promise<TransactionEntity> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      return trx.manager
        .createQueryBuilder()
        .insert()
        .into(TransactionEntity)
        .values(updateEntity)
        .returning('*')
        .execute()
        .then((result) => result.raw[0]);
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async delete(
    unqRef: TransactionUniqueRefs,
    trx?: QueryRunner,
  ): Promise<void> {
    const [key, value] = splitKeyAndValue(unqRef);

    trx.manager
      .createQueryBuilder()
      .delete()
      .from(TransactionEntity)
      .where(`"${key}" = :value`, { value })
      .execute();

    try {
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async softDelete(
    unqRef: TransactionUniqueRefs,
    trx?: QueryRunner,
  ): Promise<'success' | 'fail'> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      trx.manager.createQueryBuilder().update(TransactionEntity).set({
        deletedAt: new Date(),
      });
      return 'success';
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  getAll(trx?: QueryRunner): Promise<TransactionEntity[]> {
    try {
      return trx.manager
        .createQueryBuilder()
        .select()
        .from(TransactionEntity, 'transaction')
        .where('transaction.deletedAt IS NULL')
        .execute()
        .then((result) => result.raw);
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getWithPaginationAndFilters(
    paginationDto: GenericPaginationDto,
    trx?: QueryRunner,
  ): Promise<PaginationResult<TransactionEntity[]>> {
    throw new InternalServerErrorException('method not implmeneted');
  }
}
