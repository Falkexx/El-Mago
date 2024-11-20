import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { KEY_INJECTION } from 'src/@metadata/keys';
import {
  UserEntity,
  UserEntityUniqueRefs,
} from 'src/Application/Entities/User.entity';
import { IUserRepositoryContract } from 'src/Application/Infra/Repositories/UserRepository/IUserRepository.contract';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { v4 as uuid_v4 } from 'uuid';
import { ROLE } from 'src/@metadata/roles';
import * as bcrypt from 'bcrypt';

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

    const salt = await bcrypt.genSalt(12);

    const hashedPassword = await bcrypt.hash(userDto.password, salt);

    const userEntity = Object.assign(new UserEntity(), {
      id: uuid_v4(),
      firstName: null,
      lastName: null,
      email: userDto.email,
      cpfCnpj: null,
      country: null,
      password: hashedPassword,
      discordUserName: null,
      numberPhone: null,
      age: null,
      role: ROLE.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
      isBanned: false,
      isDeleted: false,
      softDeleted: false,
      affiliate: null,
    } as UserEntity);

    const userCreated = await this.userRepository.create(userEntity);

    return userCreated;
  }
}
