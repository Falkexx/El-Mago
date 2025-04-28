import {
  CaryRunEntity,
  CaryRunUniqueRefs,
  CaryRunUpdateEntity,
} from 'src/Application/Entities/CaryRun/CaryRun.entity';
import { GenericPaginationDto } from 'src/utils/validators';
import { QueryRunner } from 'typeorm';
import { ICaryRunRepositoryContract } from './ICaryRunRepository.contract';
import {
  CaryRunCategoryEntity,
  CaryRunCategoryUniqueRefs,
} from 'src/Application/Entities/CaryRun/CaryRunCategory.entity';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { splitKeyAndValue } from '#utils';
import { TABLE } from 'src/@metadata/tables';
import { SearchBuilderService } from '../SearchBuilder.service';
import { SearchBuilderResult } from '#types';

@Injectable()
export class CaryRunTypeOrmRepository implements ICaryRunRepositoryContract {
  constructor(private readonly searchBuilderService: SearchBuilderService) {}

  async getBy(
    unqRef: CaryRunUniqueRefs,
    trx: QueryRunner,
  ): Promise<CaryRunEntity | null> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const result = await trx.manager
        .createQueryBuilder()
        .select(TABLE.cary_run)
        .from(CaryRunEntity, TABLE.cary_run)
        .where(`"${TABLE.cary_run}"."${key}" = :value`, { value })
        .getOne();

      return result ?? null;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException('Failed to get CaryRun entity');
    }
  }

  async update(
    unqRef: CaryRunUniqueRefs,
    updateEntity: CaryRunUpdateEntity,
    trx: QueryRunner,
  ): Promise<CaryRunEntity> {
    try {
      const [key, value] = splitKeyAndValue(unqRef);
      const result = await trx.manager
        .createQueryBuilder()
        .update(CaryRunEntity)
        .set(updateEntity)
        .returning('*')
        .where(`${key} = :value`, { value })
        .execute();

      if (result.affected === 0) {
        throw new NotFoundException(`not found cary run with ${key}: ${value}`);
      }

      return result.raw[0];
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException('Failed to update CaryRun entity');
    }
  }

  async delete(unqRef: CaryRunUniqueRefs, trx: QueryRunner): Promise<void> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const result = await trx.manager
        .createQueryBuilder()
        .delete()
        .from(CaryRunEntity)
        .where(`${key} = :value`, { value })
        .execute();

      if (result.affected === 0) {
        throw new NotFoundException(`not found cary run at ${key}: ${value}`);
      }
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException('Failed to delete CaryRun entity');
    }
  }

  async softDelete(
    unqRef: CaryRunUniqueRefs,
    trx: QueryRunner,
  ): Promise<CaryRunEntity> {
    try {
      const [key, value] = splitKeyAndValue(unqRef);
      const result = await trx.manager
        .createQueryBuilder()
        .update(CaryRunEntity)
        .set({ deletedAt: new Date() })
        .returning('*')
        .where(`${key} = :value`, { value })
        .execute();

      if (result.affected === 0) {
        throw new NotFoundException(
          `error when make soft delete in cary run at ${key}: ${value}`,
        );
      }

      return result.raw[0];
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException(
        'Failed to soft delete CaryRun entity',
      );
    }
  }

  async getAll(trx: QueryRunner): Promise<CaryRunEntity[]> {
    try {
      return await trx.manager
        .createQueryBuilder(CaryRunEntity, TABLE.cary_run)
        .getMany();
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException(
        'Failed to get all CaryRun entities',
      );
    }
  }

  async getWithPaginationAndFilters(
    paginationDto: GenericPaginationDto,
    trx: QueryRunner,
  ): Promise<SearchBuilderResult<CaryRunEntity>> {
    try {
      const queryBuilder = await trx.manager.createQueryBuilder();

      const result = this.searchBuilderService.search(
        paginationDto,
        CaryRunEntity,
        TABLE.cary_run,
        queryBuilder,
      );

      return result;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException(
        'Failed to get paginated CaryRun entities',
      );
    }
  }

  async createCategory(
    entity: CaryRunCategoryEntity,
    trx: QueryRunner,
  ): Promise<CaryRunCategoryEntity> {
    try {
      return await trx.manager
        .createQueryBuilder()
        .insert()
        .into(CaryRunCategoryEntity)
        .values(entity)
        .returning('*')
        .execute()
        .then((result) => result.raw[0]);
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException(
        'Failed to create CaryRun category',
      );
    }
  }

  async getAllCategories(trx: QueryRunner): Promise<CaryRunCategoryEntity[]> {
    try {
      return await trx.manager
        .createQueryBuilder(CaryRunCategoryEntity, TABLE.cary_run_category)
        .getMany();
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException(
        'Failed to get all CaryRun categories',
      );
    }
  }

  async getCategoryBy(
    unqRef: CaryRunCategoryUniqueRefs,
    trx: QueryRunner,
  ): Promise<CaryRunCategoryEntity> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const result = await trx.manager
        .createQueryBuilder()
        .select(TABLE.cary_run_category)
        .from(CaryRunCategoryEntity, TABLE.cary_run_category)
        .where(`"${TABLE.cary_run_category}"."${key}" = :value`, { value })
        .getOne();

      return result ?? null;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException('Failed to get CaryRun category');
    }
  }

  async create(
    entity: CaryRunEntity,
    trx: QueryRunner,
  ): Promise<CaryRunEntity> {
    try {
      return await trx.manager
        .createQueryBuilder()
        .insert()
        .into(CaryRunEntity)
        .values(entity)
        .returning('*')
        .execute()
        .then((result) => result.raw[0]);
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException('Failed to create CaryRun entity');
    }
  }

  async getManyCategories(
    pagination: GenericPaginationDto,
    trx: QueryRunner,
  ): Promise<SearchBuilderResult<CaryRunCategoryEntity>> {
    try {
      const result = await this.searchBuilderService.search(
        pagination,
        CaryRunEntity,
        TABLE.cary_run_category,
        trx.manager.createQueryBuilder(),
      );

      return result;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
