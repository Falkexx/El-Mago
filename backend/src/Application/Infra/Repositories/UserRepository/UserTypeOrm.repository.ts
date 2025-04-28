import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  UserEntity,
  UserEntityUniqueRefs,
  UserUpdateEntity,
} from 'src/Application/Entities/User.entity';
import { QueryRunner } from 'typeorm';
import { IUserRepositoryContract } from './IUserRepository.contract';
import { splitKeyAndValue } from '#utils';
import { GenericPaginationDto } from 'src/utils/validators';
import { TABLE } from 'src/@metadata/tables';
import { SearchBuilderResult } from '#types';
import { SearchBuilderService } from '../SearchBuilder.service';

@Injectable()
export class UserTypeOrmRepository implements IUserRepositoryContract {
  constructor(private readonly searchBuilderService: SearchBuilderService) {}

  async getByEmail(
    email: string,
    trx: QueryRunner,
  ): Promise<UserEntity | null> {
    try {
      const user = await trx.manager
        .createQueryBuilder()
        .select(TABLE.user)
        .from(UserEntity, TABLE.user)
        .where(`"${TABLE.user}"."email" = :email`, { email })
        .getOne();

      return user ?? null;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async create(entity: UserEntity, trx: QueryRunner): Promise<UserEntity> {
    try {
      return (
        await trx.manager
          .createQueryBuilder()
          .insert()
          .into(UserEntity)
          .values(entity)
          .returning('*')
          .execute()
      ).raw[0];
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getBy(
    unqRef: UserEntityUniqueRefs,
    trx: QueryRunner,
  ): Promise<UserEntity | null> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const user = await trx.manager
        .createQueryBuilder()
        .select(TABLE.user)
        .from(UserEntity, TABLE.user)
        .where(`"${TABLE.user}"."${key}" = :value`, { value })
        .getOne();

      return user ?? null;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async update(
    unqRef: UserEntityUniqueRefs,
    updateEntity: Partial<UserUpdateEntity>,
    trx: QueryRunner,
  ): Promise<UserEntity> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const result = await trx.manager
        .createQueryBuilder()
        .update(UserEntity)
        .set(updateEntity)
        .where(`"${TABLE.user}"."${key}" = :value`, { value })
        .returning('*')
        .execute();

      if (result.affected === 0) {
        throw new Error(
          `rows affected is 0 when make the update of ${key}: ${value}`,
        );
      }

      return result.raw[0];
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async delete(unqRef: UserEntityUniqueRefs, trx?: QueryRunner): Promise<void> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const result = await trx.manager
        .createQueryBuilder()
        .delete()
        .from(UserEntity)
        .where(`"${TABLE.user}."${value}" = :${value}"`, { value })
        .returning('*')
        .execute();

      if (result.affected === 0) {
        throw new Error(
          `rows affected is 0 when make the delete of ${key}: ${value}`,
        );
      }

      return result.raw[0];
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async softDelete(
    unqRef: UserEntityUniqueRefs,
    trx: QueryRunner,
  ): Promise<UserEntity> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const result = await trx.manager
        .createQueryBuilder()
        .update(UserEntity)
        .set({
          isDeleted: true,
        } as Partial<UserEntity>)
        .where(`"${TABLE.user}."${key}" = :${value}`, { value })
        .returning('*')
        .execute();

      if (result.affected === 0) {
        throw new Error(
          `rows affected is 0 when make the soft delete of ${key}: ${value}`,
        );
      }

      return result.raw[0];
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getAll(trx: QueryRunner): Promise<UserEntity[]> {
    try {
      return await trx.manager
        .createQueryBuilder()
        .select('*')
        .from(UserEntity, TABLE.user)
        .getMany();
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getWithPaginationAndFilters(
    paginationDto: GenericPaginationDto,
    trx: QueryRunner,
  ): Promise<SearchBuilderResult<UserEntity>> {
    try {
      const queryBuilder = trx.manager.createQueryBuilder();

      const result = await this.searchBuilderService.search(
        paginationDto,
        UserEntity,
        TABLE.user,
        queryBuilder,
      );

      return result;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }
}
