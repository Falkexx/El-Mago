import { IUserRepositoryContract } from 'src/Application/Infra/Repositories/UserRepository/IUserRepository.contract';
import { UpdateUserDto } from './UpdateUser.dto';
import { Inject, NotFoundException } from '@nestjs/common';
import { KEY_INJECTION } from 'src/@metadata/keys';
import { PayloadType } from '#types';
import { UserUpdateEntity } from 'src/Application/Entities/User.entity';

export class UpdateUserUseCase {
  constructor(
    @Inject(KEY_INJECTION.USER_REPOSITORY_CONTRACT)
    private readonly userRepository: IUserRepositoryContract,
  ) {}

  async execute({ sub }: PayloadType, userDto: UpdateUserDto) {
    const user = await this.userRepository.getBy({ id: sub });

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
    );

    return userUpdated;
  }
}
