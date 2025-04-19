import { IUserRepositoryContract } from 'src/Application/Infra/Repositories/UserRepository/IUserRepository.contract';
import { UpdateUserDto } from './UpdateUser.dto';
import { Inject, NotFoundException } from '@nestjs/common';
import { KEY_INJECTION } from 'src/@metadata/keys';
import { PayloadType } from '#types';
import { UserUpdateEntity } from 'src/Application/Entities/User.entity';
import { DataSource } from 'typeorm';

export class UpdateUserUseCase {
  constructor(
    @Inject(KEY_INJECTION.USER_REPOSITORY_CONTRACT)
    private readonly userRepository: IUserRepositoryContract,
    private readonly dataSource: DataSource,
  ) {}

  async execute({ sub }: PayloadType, userDto: UpdateUserDto) {
    const trx = this.dataSource.createQueryRunner();

    try {
      await trx.startTransaction();

      const user = await this.userRepository.getBy({ id: sub }, trx);

      if (!user) {
        throw new NotFoundException('user not found');
      }

      const userUpdate = Object.assign(new UserUpdateEntity(), {
        firstName: userDto.firstName,
        lastName: userDto.lastName,
        country: userDto.country,
        discord: userDto.discord,
        numberPhone: userDto.numberPhone,
        fluentLanguages: userDto.fluentLanguages,
      } as UserUpdateEntity);

      const userUpdated = await this.userRepository.update(
        { id: sub },
        userUpdate,
        trx,
      );

      await trx.commitTransaction();

      return userUpdated;
    } catch (e) {
      await trx.rollbackTransaction();
      throw e;
    } finally {
      await trx.release();
    }
  }
}
