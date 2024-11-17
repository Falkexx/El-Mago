import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../User/User.service';
import { PayloadType } from '#types';
import { CreateUserDto } from '../User/dtos/CreateUser.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import { UserEntity } from 'src/Application/Entities/User.entity';
import * as bcrypt from 'bcrypt';
import { env } from '#utils';
import { ROLE } from 'src/@metadata/roles';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(userDto: CreateUserDto) {
    const user = await this.userService.create(userDto);

    const token = await this.generateToken(user);

    return {
      user,
      accessToken: token,
    };
  }

  async sinIn(authDto: AuthDto) {
    const user = await this.userService.getUserBy({ email: authDto.email });

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!this.isAdmin(authDto.email, authDto.password)) {
      await this.isPasswordMatch(authDto.password, user.password);
    }

    const token = await this.generateToken(user);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    return {
      user,
      accessToken: token,
    };
  }

  private async generateToken(user: UserEntity): Promise<string> {
    const isAdmin = await this.isAdmin(user.email, user.password);

    const payload: PayloadType = {
      sub: user.id,
      roles: [user.role, isAdmin ? ROLE.ADMIN : undefined],
      isBanned: !isAdmin ? user.isBanned : false,
      softDeleted: !isAdmin ? user.softDeleted : false,
    };

    const token = this.jwtService.sign(payload);

    return token;
  }

  private async isAdmin(email: string, password: string) {
    return env.ADMIN_EMAIL === email && env.ADMIN_PASSWORD === password;
  }

  private async isPasswordMatch(password: string, hashedPassword: string) {
    const isThePasswordCorrect = await bcrypt.compare(password, hashedPassword);

    if (!isThePasswordCorrect) {
      throw new UnauthorizedException();
    }
  }
}
