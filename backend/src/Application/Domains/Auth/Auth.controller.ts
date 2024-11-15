import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../User/dtos/CreateUser.dto';
import { AuthService } from './Auth.service';
import { AuthDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { plainToInstance } from 'class-transformer';
import { UserEntity } from 'src/Application/Entities/User.entity';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  async signUp(@Body() userDto: CreateUserDto) {
    const result = plainToInstance(
      UserEntity,
      await this.authService.signUp(userDto),
      { exposeUnsetFields: true },
    );

    return result;
  }

  @Post('signIn')
  async signIn(@Body() authDto: AuthDto) {
    const result = plainToInstance(
      UserEntity,
      await this.authService.sinIn(authDto),
      { exposeUnsetFields: true },
    );

    return result;
  }

  @Get('protected')
  @UseGuards(JwtAuthGuard)
  async protected() {
    return 'congratulations, you have accessed';
  }
}
