import {
  UserEntity,
  UserEntityUniqueRefs,
  UserUpdateEntity,
} from 'src/Application/Entities/User.entity';
import { IBaseRepositoryContract } from '../IBase.repository-contract';
import { QueryRunner } from 'typeorm';

export interface IUserRepositoryContract
  extends IBaseRepositoryContract<
    UserEntity,
    Partial<UserUpdateEntity>,
    UserEntityUniqueRefs
  > {
  getByEmail(email: string, trx: QueryRunner): Promise<UserEntity | null>;
}
