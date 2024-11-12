import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { KEY_INJECTION } from 'src/@metadata/keys';
import {
  UserEntity,
  UserEntityUniqueRefs,
} from 'src/Application/Entities/User.entity';
import { IUserRepositoryContract } from 'src/Application/Infra/Repositories/UserRepository/IUserRepository.contract';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { v4 as uuid_v4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    @Inject(KEY_INJECTION.USER_REPOSITORY_CONTRACT)
    private readonly userRepository: IUserRepositoryContract,
  ) {}

  async getUserBy(uniqueRef: UserEntityUniqueRefs) {
    const user = await this.userRepository.getBy(uniqueRef);

    return user;
  }

  async create(userDto: CreateUserDto): Promise<UserEntity> {
    const checkIfEmailInUsed = await this.userRepository.getBy({
      email: userDto.email,
    });

    if (checkIfEmailInUsed) {
      throw new UnauthorizedException('email in used');
    }

    const userEntity = Object.assign(new UserEntity(), {
      id: uuid_v4(),
      firstName: userDto.firstName,
      lastName: userDto.lastName,
      name: userDto.firstName + ' ' + userDto.lastName,
      email: userDto.email,
      cpfCnpj: null,
      country: null,
      password: userDto.password, // tem que criptografar
      discordUserName: null,
      numberPhone: null,
      age: null,
      role: 'USER',
      createdAt: new Date(),
      updatedAt: new Date(),
      isBanned: false,
      isDeleted: false,
    } as UserEntity);

    const userCreated = await this.userRepository.create(userEntity);

    return userCreated;
  }
}
