import {
  ItemEntity,
  ItemUniquePrams,
  ItemUpdateEntity,
} from 'src/Application/Entities/Item.entity';
import { IBaseRepositoryContract } from '../IBase.repository-contract';
import { SelectFieldsWithRelations } from '#types';
import { CategoryEntity } from 'src/Application/Entities/Category.entity';

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
    relations?: Relations[],
  ): Promise<SelectFieldsWithRelations<ItemEntity, Fields, Relations>[]>;

  getOneOptimized<
    Fields extends keyof ItemEntity,
    Relations extends keyof ItemEntity,
  >(
    where: ItemUniquePrams,
    fields: Fields[],
    relations?: Relations[],
  ): Promise<SelectFieldsWithRelations<ItemEntity, Fields, Relations>>;

  pushCategory(
    unqRef: ItemUniquePrams,
    category: CategoryEntity,
  ): Promise<ItemEntity>;
};
