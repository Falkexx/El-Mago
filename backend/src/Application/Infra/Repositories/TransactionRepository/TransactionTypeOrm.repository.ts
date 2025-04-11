import {
  TransactionEntity,
  TransactionUniqueRefs,
} from 'src/Application/Entities/Transactions.entity';
import { GenericPaginationDto } from 'src/utils/validators';
import { QueryRunner } from 'typeorm';
import { ITransactionRepositoryContract } from './ITransaction.repository-contract';
import {
  Injectable,
  InternalServerErrorException,
  NotImplementedException,
} from '@nestjs/common';
import { splitKeyAndValue } from '#utils';
import { PaginationResult } from '#types';
import { TABLE } from 'src/@metadata/tables';

@Injectable()
export class TransactionTypeOrmRepository
  implements ITransactionRepositoryContract
{
  async create(
    entity: TransactionEntity,
    trx?: QueryRunner,
  ): Promise<TransactionEntity> {
    try {
      return (
        await trx.manager
          .createQueryBuilder()
          .insert()
          .into(TransactionEntity)
          .values(entity)
          .returning('*')
          .execute()
      ).raw[0];
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getBy(
    unqRef: TransactionUniqueRefs,
    trx?: QueryRunner,
  ): Promise<TransactionEntity> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      return await trx.manager
        .createQueryBuilder()
        .select()
        .from(TransactionEntity, 'transaction')
        .where(`"${key}" = :value`, { value })
        .andWhere(`"deletedAt" IS NULL`)
        .getOne();
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async update(
    unqRef: TransactionUniqueRefs,
    updateEntity: Partial<TransactionEntity>,
    trx: QueryRunner,
  ): Promise<TransactionEntity> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const result = await trx.manager
        .createQueryBuilder()
        .update(TransactionEntity)
        .set(updateEntity)
        .where(`"${TABLE.transaction}."${key}" = :${value}`, { value })
        .returning('*')
        .execute();

      if (result.affected === 0) {
        throw new Error(
          `Rows affected is 0 when update transaction with ${key}: ${value}`,
        );
      }

      return result[0];
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

    const result = await trx.manager
      .createQueryBuilder()
      .delete()
      .from(TransactionEntity)
      .where(`"${key}" = :value`, { value })
      .execute();

    if (result.affected === 0) {
      throw new Error(
        `error when delete permanently transaction with ${key}: ${value}`,
      );
    }

    try {
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async softDelete(
    unqRef: TransactionUniqueRefs,
    trx?: QueryRunner,
  ): Promise<TransactionEntity> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      throw new NotImplementedException(
        'transaction entity not have soft delete property',
      );

      // const result = await trx.manager
      //   .createQueryBuilder()
      //   .update(TransactionEntity)
      //   .set({
      //     deletedAt: new Date(),
      //   })
      //   .where(`"${TABLE.transaction}."${key}" = :${value}`, { value })
      //   .returning('*')
      //   .execute();
      // if (result.affected === 0) {
      //   throw new Error(
      //     `error when soft delete transaction with ${key}: ${value}`,
      //   );
      // }
      // return result.raw[0];
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  getAll(trx?: QueryRunner): Promise<TransactionEntity[]> {
    try {
      const result = trx.manager
        .createQueryBuilder()
        .select()
        .from(TransactionEntity, 'transaction')
        .getMany();

      return result;
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
