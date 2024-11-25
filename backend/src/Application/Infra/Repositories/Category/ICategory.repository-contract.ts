import {
  CategoryEntity,
  CategoryUniqueRefs,
  CategoryUpdateEntity,
} from 'src/Application/Entities/Category.entity';
import { IBaseRepositoryContract } from '../IBase.repository-contract';

export type ICategoryRepositoryContract = IBaseRepositoryContract<
  CategoryEntity,
  CategoryUpdateEntity,
  CategoryUniqueRefs
>;
