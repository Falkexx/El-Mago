import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PayloadType } from '#types';
import { CreateUserDto } from '../User/dtos/CreateUser.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import { UserEntity } from 'src/Application/Entities/User.entity';
import * as bcrypt from 'bcrypt';
import { env, generateShortId, shortId } from '#utils';
import { ROLE } from 'src/@metadata/roles';
import { IUserRepositoryContract } from 'src/Application/Infra/Repositories/UserRepository/IUserRepository.contract';
import { KEY_INJECTION } from 'src/@metadata/keys';
import { DataSource } from 'typeorm';
import { ICartRepositoryContract } from 'src/Application/Infra/Repositories/CartRepository/ICartRepository.contract';
import { v4 as uuid_v4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(KEY_INJECTION.USER_REPOSITORY_CONTRACT)
    private readonly userRepository: IUserRepositoryContract,
    @Inject(KEY_INJECTION.CART_REPOSITORY)
    private readonly cartRepository: ICartRepositoryContract,

    private readonly dataSource: DataSource,
  ) {}

  async signUp(userDto: CreateUserDto) {
    const trx = this.dataSource.createQueryRunner();

    try {
      trx.startTransaction();

      // let user = await this.userService.create(userDto);
      const checkIfEmailInUsed = await this.userRepository.getBy({
        email: userDto.email,
      });

      if (checkIfEmailInUsed) {
        throw new UnauthorizedException('email in used');
      }

      const salt = await bcrypt.genSalt(12);

      const hashedPassword = await bcrypt.hash(userDto.password, salt);

      let user = await this.userRepository.create(
        {
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
          roles: [ROLE.USER],
          createdAt: new Date(),
          updatedAt: new Date(),
          isBanned: false,
          isDeleted: false,
          softDeleted: false,
          affiliate: null,
          affiliateId: null,
          items: [],
          orders: [],
          cart: null,
          fluentLanguages: [],
          RequestAffiliate: null,
          Account: null,
        } as UserEntity,
        trx,
      );

      await this.cartRepository.create({
        id: generateShortId(10),
        items: [],
        user: user,
        userId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const isAdmin = this.isAdmin(userDto.email, userDto.password);

      if (user.email === env.ADMIN_EMAIL && !user.roles.includes(ROLE.ADMIN)) {
        user = await this.userRepository.update(
          {
            id: user.id,
          },
          {
            roles: [...user.roles, ROLE.ADMIN],
          },
          trx,
        );
      }

      const token = await this.generateToken({
        ...user,

        // use only to check if user is admin, and check if password from admin is valid.
        password: isAdmin ? userDto.password : user.password,
      });

      trx.commitTransaction();

      return {
        user: user,
        accessToken: token,
      };
    } catch (e) {
      trx.rollbackTransaction();
      throw e;
    }
  }

  async sinIn(authDto: AuthDto) {
    let user = await this.userRepository.getBy({ email: authDto.email });

    if (!user) {
      throw new UnauthorizedException();
    }

    const isAdmin = this.isAdmin(authDto.email, authDto.password);

    if (!isAdmin) {
      await this.isPasswordMatch(authDto.password, user.password);
    }

    if (isAdmin && !user.roles.includes(ROLE.ADMIN)) {
      user = await this.userRepository.update(
        {
          id: user.id,
        },
        {
          roles: [...user.roles, ROLE.ADMIN],
        },
      );
    }

    const token = await this.generateToken({
      ...user,
      password: isAdmin ? authDto.password : user.password,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    return {
      user,
      accessToken: token,
    };
  }

  private async generateToken(
    user: Pick<
      UserEntity,
      'id' | 'roles' | 'isBanned' | 'isDeleted' | 'email' | 'password'
    >,
  ): Promise<string> {
    const isAdmin = this.isAdmin(user.email, user.password);

    const payload: PayloadType = {
      sub: user.id,
      roles: user.roles,
      isBanned: !isAdmin ? user.isBanned : false,
      isDeleted: !isAdmin ? user.isDeleted : false,
    };

    const token = this.jwtService.sign(payload);

    return token;
  }

  private isAdmin(email: string, password: string) {
    return env.ADMIN_EMAIL === email && env.ADMIN_PASSWORD === password;
  }

  private async isPasswordMatch(password: string, hashedPassword: string) {
    const isThePasswordCorrect = await bcrypt.compare(password, hashedPassword);

    if (!isThePasswordCorrect) {
      throw new UnauthorizedException();
    }
  }
}
