import {
  ImageEntity,
  ImageUniqueRef,
  ImageUpdateEntity,
} from 'src/Application/Entities/Image.entity';
import { IBaseRepositoryContract } from '../IBase.repository-contract';

export type IIMageRepositoryContract = IBaseRepositoryContract<
  ImageEntity,
  ImageUpdateEntity,
  ImageUniqueRef
>;
