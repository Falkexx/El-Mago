import {
  CartEntity,
  CartUniqueRef,
  CartUpdateEntity,
} from 'src/Application/Entities/Cart/Cart.entity';
import { IBaseRepositoryContract } from '../IBase.repository-contract';

export type ICartRepositoryContract = IBaseRepositoryContract<
  CartEntity,
  CartUpdateEntity,
  CartUniqueRef
> & {};
