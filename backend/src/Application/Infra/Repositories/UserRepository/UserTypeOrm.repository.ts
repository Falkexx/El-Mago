import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  UserEntity,
  UserEntityUniqueRefs,
  UserUpdateEntity,
} from 'src/Application/Entities/User.entity';
import { QueryRunner, Repository } from 'typeorm';
import { IUserRepositoryContract } from './IUserRepository.contract';
import { splitKeyAndValue } from '#utils';
import { PaginationResult } from '#types';
import { GenericPaginationDto } from 'src/utils/validators';
import { TABLE } from 'src/@metadata/tables';

@Injectable()
export class UserTypeOrmRepository implements IUserRepositoryContract {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({ where: { email } });

    return user ?? null;
  }

  async create(entity: UserEntity): Promise<UserEntity> {
    try {
      const userTypeOrmEntity = await this.userRepository.create(entity);

      const userCreated = await this.userRepository.save(userTypeOrmEntity);

      return userCreated;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getBy(unqRef: UserEntityUniqueRefs): Promise<UserEntity | null> {
    const [key, value] = splitKeyAndValue(unqRef);

    const user = await this.userRepository.findOneBy({ [key]: value });

    return user ?? null;
  }

  async update(
    unqRef: UserEntityUniqueRefs,
    updateEntity: Partial<UserUpdateEntity>,
    trx?: QueryRunner,
  ): Promise<UserEntity> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const result = await trx.manager
        .createQueryBuilder()
        .update(UserEntity)
        .set(updateEntity)
        .where(`"${TABLE.user}"."${key}" = :value`, { value })
        .returning('*')
        .execute();

      return result.raw[0] as UserEntity;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async delete(unqRef: UserEntityUniqueRefs, trx?: QueryRunner): Promise<void> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      await trx.manager.delete(UserEntity, { [key]: value });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async softDelete(unqRef: UserEntityUniqueRefs): Promise<'success' | 'fail'> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const user = await this.userRepository.findOne({ [key]: value });

      const newUser = Object.assign(user, {
        isDeleted: true,
      } as UserUpdateEntity);

      await this.userRepository.save(newUser);
      return 'success';
    } catch {
      return 'fail';
    }
  }

  async getAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async getWithPaginationAndFilters(
    paginationDto: GenericPaginationDto,
  ): Promise<PaginationResult<UserEntity[]>> {
    const { page, limit, search, filters, order } = paginationDto;

    const queryBuilder = this.userRepository.createQueryBuilder(TABLE.user);

    if (search) {
      queryBuilder.andWhere(`SIMILARITY(${TABLE.user}.name, :search) > 0.3`, {
        search: `%${search}`,
      });
    }

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        queryBuilder.andWhere(`${TABLE.user}.${key} = :${key}`, {
          [key]: value,
        });
      });
    }

    queryBuilder.orderBy(`${TABLE.user}.createdAt`, order || 'DESC');

    const [users, total] = await queryBuilder
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();

    return {
      data: users,
      page,
      limit,
      total,
      order,
    };
  }
}
