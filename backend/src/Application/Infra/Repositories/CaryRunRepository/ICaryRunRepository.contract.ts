import {
  CaryRunEntity,
  CaryRunUniqueRefs,
  CaryRunUpdateEntity,
} from 'src/Application/Entities/CaryRun/CaryRun.entity';
import { IBaseRepositoryContract } from '../IBase.repository-contract';
import {
  CaryRunCategoryEntity,
  CaryRunCategoryUniqueRefs,
} from 'src/Application/Entities/CaryRun/CaryRunCategory.entity';
import { QueryRunner } from 'typeorm';
import { GenericPaginationDto } from 'src/utils/validators';
import { SearchBuilderResult } from '#types';

export interface ICaryRunRepositoryContract
  extends IBaseRepositoryContract<
    CaryRunEntity,
    CaryRunUpdateEntity,
    CaryRunUniqueRefs
  > {
  createCategory(
    entity: CaryRunCategoryEntity,
    trx: QueryRunner,
  ): Promise<CaryRunCategoryEntity>;
  getAllCategories(trx: QueryRunner): Promise<CaryRunCategoryEntity[]>;
  getCategoryBy(
    unqRef: CaryRunCategoryUniqueRefs,
    trx: QueryRunner,
  ): Promise<CaryRunCategoryEntity>;
  getManyCategories(
    pagination: GenericPaginationDto,
    trx: QueryRunner,
  ): Promise<SearchBuilderResult<CaryRunCategoryEntity>>;
}
