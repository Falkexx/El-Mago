import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../User/User.service';
import { PayloadType } from '#types';
import { CreateUserDto } from '../User/dtos/CreateUser.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import { UserEntity } from 'src/Application/Entities/User.entity';
import * as bcrypt from 'bcrypt';
import { env } from '#utils';
import { ROLE } from 'src/@metadata/roles';
import { IUserRepositoryContract } from 'src/Application/Infra/Repositories/UserRepository/IUserRepository.contract';
import { KEY_INJECTION } from 'src/@metadata/keys';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(KEY_INJECTION.USER_REPOSITORY_CONTRACT)
    private readonly userRepository: IUserRepositoryContract,
  ) {}

  async signUp(userDto: CreateUserDto) {
    let user = await this.userService.create(userDto);

    const isAdmin = this.isAdmin(userDto.email, userDto.password);

    if (user.email === env.ADMIN_EMAIL && !user.roles.includes(ROLE.ADMIN)) {
      user = await this.userRepository.update(
        {
          id: user.id,
        },
        {
          roles: [...user.roles, ROLE.ADMIN],
        },
      );

      console.log(user);
    }

    const token = await this.generateToken({
      ...user,
      password: isAdmin ? userDto.password : user.password,
    });

    return {
      user,
      accessToken: token,
    };
  }

  async sinIn(authDto: AuthDto) {
    let user = await this.userService.getUserBy({ email: authDto.email });

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

  private async generateToken(user: UserEntity): Promise<string> {
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
