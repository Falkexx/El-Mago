import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  CategoryEntity,
  CategoryUniqueRefs,
  CategoryUpdateEntity,
} from 'src/Application/Entities/Category.entity';
import { QueryRunner } from 'typeorm';
import { ICategoryRepositoryContract } from './ICategory.repository-contract';
import { splitKeyAndValue } from '#utils';
import { GenericPaginationDto } from 'src/utils/validators';
import { TABLE } from 'src/@metadata/tables';
import { SearchBuilderService } from '../SearchBuilder.service';
import { SearchBuilderResult } from '#types';

@Injectable()
export class CategoryTypeOrmRepository implements ICategoryRepositoryContract {
  constructor(private readonly searchBuilderService: SearchBuilderService) {}

  async create(
    entity: CategoryEntity,
    trx: QueryRunner,
  ): Promise<CategoryEntity> {
    try {
      const result = await trx.manager
        .createQueryBuilder()
        .insert()
        .into(CategoryEntity)
        .values(entity)
        .returning('*')
        .execute();

      return result.raw[0];
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getBy(
    unqRef: CategoryUniqueRefs,
    trx: QueryRunner,
  ): Promise<CategoryEntity | null> {
    try {
      const [key, value] = splitKeyAndValue(unqRef);

      const category = await trx.manager
        .createQueryBuilder(CategoryEntity, 'category')
        .where(`"${TABLE.category}"."${key}" = :value`, { value })
        .getOne();

      return category ?? null;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async update(
    unqRef: CategoryUniqueRefs,
    updateEntity: CategoryUpdateEntity,
    trx: QueryRunner,
  ): Promise<CategoryEntity> {
    try {
      const [key, value] = splitKeyAndValue(unqRef);

      const result = await trx.manager
        .createQueryBuilder()
        .update(CategoryEntity)
        .set(updateEntity)
        .where(`"${TABLE.category}"."${key}" = :value`, { value })
        .andWhere(`"${TABLE.category}"."deletedAt" IS NULL`)
        .returning('*')
        .execute();

      if (!result.raw[0]) {
        throw new InternalServerErrorException('Category not found or deleted');
      }

      return result.raw[0];
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async delete(unqRef: CategoryUniqueRefs, trx: QueryRunner): Promise<void> {
    try {
      const [key, value] = splitKeyAndValue(unqRef);

      const result = await trx.manager
        .createQueryBuilder()
        .delete()
        .from(CategoryEntity)
        .where(`"${TABLE.category}"."${key}" = :value`, { value })
        .andWhere(`"${TABLE.category}"."deletedAt" IS NULL`)
        .execute();

      if (result.affected === 0) {
        throw new InternalServerErrorException('Category not found or deleted');
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async softDelete(
    unqRef: CategoryUniqueRefs,
    trx: QueryRunner,
  ): Promise<CategoryEntity> {
    try {
      const [key, value] = splitKeyAndValue(unqRef);

      const result = await trx.manager
        .createQueryBuilder()
        .update(CategoryEntity)
        .set({ deletedAt: new Date() })
        .where(`"${TABLE.category}"."${key}" = :value`, { value })
        .andWhere(`"${TABLE.category}"."deletedAt" IS NULL`)
        .returning('*')
        .execute();

      if (!result.raw[0]) {
        throw new Error('Category not found or already deleted');
      }

      return result.raw[0];
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async getAll(trx: QueryRunner): Promise<CategoryEntity[]> {
    try {
      return await trx.manager
        .createQueryBuilder(CategoryEntity, 'category')
        .where(`"${TABLE.category}"."deletedAt" IS NULL`)
        .getMany();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getWithPaginationAndFilters(
    paginationDto: GenericPaginationDto,
    trx: QueryRunner,
  ): Promise<SearchBuilderResult<CategoryEntity>> {
    const queryBuilder = trx.manager.createQueryBuilder();

    const searchResult = await this.searchBuilderService.search(
      paginationDto,
      CategoryEntity,
      TABLE.category,
      queryBuilder,
    );

    return {
      data: searchResult.data,
      meta: searchResult.meta,
    };
  }
}
