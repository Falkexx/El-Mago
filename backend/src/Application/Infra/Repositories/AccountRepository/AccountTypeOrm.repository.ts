import {
  Injectable,
  InternalServerErrorException,
  NotImplementedException,
} from '@nestjs/common';
import { IAccountRepositoryContract } from './IAccount.repository-contract';
import { PaginationResult } from '#types';
import {
  AccountEntity,
  AccountUniqueRefs,
  AccountUpdateEntity,
} from 'src/Application/Entities/Account.entity';
import { GenericPaginationDto } from 'src/utils/validators';
import { splitKeyAndValue } from '#utils';
import { EntityManager, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TABLE } from 'src/@metadata/tables';

@Injectable()
export class AccountTypeOrmRepository implements IAccountRepositoryContract {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {}

  async create(
    entity: AccountEntity,
    trx?: QueryRunner,
  ): Promise<AccountEntity> {
    try {
      const result = (
        await trx.manager
          .createQueryBuilder()
          .insert()
          .into(AccountEntity)
          .values(entity)
          .returning('*')
          .execute()
      ).raw[0];

      return result;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getBy(unqRef: AccountUniqueRefs): Promise<AccountEntity> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const account = await this.accountRepository
        .createQueryBuilder()
        .select('*')
        .from(AccountEntity, TABLE.account)
        .where(`"${TABLE.account}"."${key}" = :value`, { value })
        .andWhere(`"${TABLE.account}"."deletedAt" IS NULL`)
        .getOne();

      return account;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async update(
    unqRef: AccountUniqueRefs,
    updateEntity: AccountUpdateEntity,
  ): Promise<AccountEntity> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      await this.accountRepository
        .createQueryBuilder()
        .update(AccountEntity)
        .set(updateEntity)
        .where(`"${TABLE.account}"."${key}" = :value`, { value })
        .andWhere(`"${TABLE.account}"."deletedAt" IS NULL`)
        .execute();

      return await this.getBy(unqRef);
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async delete(unqRef: AccountUniqueRefs): Promise<void> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      await this.accountRepository
        .createQueryBuilder()
        .delete()
        .from(AccountEntity)
        .where(`"${TABLE.account}"."${key}" = :value`, { value })
        .execute();
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async softDelete(unqRef: AccountUniqueRefs): Promise<'success' | 'fail'> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const result = await this.accountRepository
        .createQueryBuilder()
        .update(AccountEntity)
        .set({ deletedAt: new Date() })
        .where(`"${TABLE.account}"."${key}" = :value`, { value })
        .andWhere(`"${TABLE.account}"."deletedAt" IS NULL`)
        .execute();

      return result.affected > 0 ? 'success' : 'fail';
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getAll(): Promise<AccountEntity[]> {
    try {
      return await this.accountRepository
        .createQueryBuilder()
        .select('*')
        .from(AccountEntity, TABLE.account)
        .where(`"${TABLE.account}"."deletedAt" IS NULL`)
        .getMany();
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getWithPaginationAndFilters(
    paginationDto: GenericPaginationDto,
  ): Promise<PaginationResult<AccountEntity[]>> {
    throw new NotImplementedException('method not implemented');
    //   const { page = 1, limit = 10 } = paginationDto;

    //   try {
    //     const queryBuilder = this.accountRepository
    //       .createQueryBuilder(TABLE.account)
    //       .where(`"${TABLE.account}"."deletedAt" IS NULL`);

    //     const [data, total] = await queryBuilder
    //       .skip((page - 1) * limit)
    //       .take(limit)
    //       .getManyAndCount();

    //     return {
    //       data,
    //       total,
    //       page,
    //       limit,
    //       totalPages: Math.ceil(total / limit),
    //     };
    //   } catch (e) {
    //     console.error(e);
    //     throw new InternalServerErrorException();
    //   }
  }
}
