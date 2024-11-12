import { Injectable } from '@nestjs/common';
import { UserService } from '../User/User.service';
import { PayloadType } from '#types';
import { CreateUserDto } from '../User/dtos/CreateUser.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(userDto: CreateUserDto) {
    const user = await this.userService.create(userDto);

    const payload: PayloadType = {
      sub: user.id,
      roles: [user.role],
    };

    const token = this.jwtService.sign(payload);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ..._user } = user;

    return {
      user: _user,
      accessToken: token,
    };
  }
}
