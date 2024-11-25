import {
  ItemEntity,
  ItemUniquePrams,
  ItemUpdateEntity,
} from 'src/Application/Entities/Item.entity';
import { IBaseRepositoryContract } from '../IBase.repository-contract';

export type IItemRepositoryContract = IBaseRepositoryContract<
  ItemEntity,
  ItemUpdateEntity,
  ItemUniquePrams
>;
