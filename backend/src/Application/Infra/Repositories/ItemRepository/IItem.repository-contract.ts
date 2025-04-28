import {
  ItemEntity,
  ItemUniquePrams,
  ItemUpdateEntity,
} from 'src/Application/Entities/Item/Item.entity';
import { IBaseRepositoryContract } from '../IBase.repository-contract';
import { SelectFieldsWithRelations } from '#types';
import { CategoryEntity } from 'src/Application/Entities/Category.entity';
import { QueryRunner } from 'typeorm';

export type IItemRepositoryContract = IBaseRepositoryContract<
  ItemEntity,
  ItemUpdateEntity,
  ItemUniquePrams
> & {
  getOptimized<
    Fields extends keyof ItemEntity,
    Relations extends keyof ItemEntity,
  >(
    where: ItemUniquePrams,
    fields: Fields[],
    trx: QueryRunner,
    relations?: Relations[],
  ): Promise<SelectFieldsWithRelations<ItemEntity, Fields, Relations>[]>;

  getOneOptimized<
    Fields extends keyof ItemEntity,
    Relations extends keyof ItemEntity,
  >(
    where: ItemUniquePrams,
    fields: Fields[],
    trx: QueryRunner,
    relations?: Relations[],
  ): Promise<SelectFieldsWithRelations<ItemEntity, Fields, Relations>>;

  pushCategory(
    unqRef: ItemUniquePrams,
    category: CategoryEntity,
    trx: QueryRunner,
  ): Promise<ItemEntity>;

  getManyByIds(ids: string[], trx: QueryRunner): Promise<ItemEntity[]>;
};
