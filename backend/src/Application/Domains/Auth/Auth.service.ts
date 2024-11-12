import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../User/User.service';
import { PayloadType } from '#types';
import { CreateUserDto } from '../User/dtos/CreateUser.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import { UserEntity } from 'src/Application/Entities/User.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(userDto: CreateUserDto) {
    const user = await this.userService.create(userDto);

    const token = await this.generateToken(user);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ..._user } = user;

    return {
      user: _user,
      accessToken: token,
    };
  }

  async sinIn(authDto: AuthDto) {
    const user = await this.userService.getUserBy({ email: authDto.email });

    if (!user) {
      throw new UnauthorizedException();
    }

    const isThePasswordCorrect = await bcrypt.compare(
      authDto.password,
      user.password,
    );

    if (!isThePasswordCorrect) {
      throw new UnauthorizedException();
    }

    const token = await this.generateToken(user);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ..._user } = user;

    return {
      user: _user,
      accessToken: token,
    };
  }

  private async generateToken(user: UserEntity): Promise<string> {
    const payload: PayloadType = {
      sub: user.id,
      roles: [user.role],
    };

    const token = this.jwtService.sign(payload);

    return token;
  }
}
