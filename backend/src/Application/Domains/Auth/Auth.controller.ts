import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../User/dtos/CreateUser.dto';
import { AuthService } from './Auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  async signUp(@Body() userDto: CreateUserDto) {
    return this.authService.signUp(userDto);
  }

  @Post('signIn')
  async signIn(@Body() authDto: AuthDto) {
    return this.authService.sinIn(authDto);
  }
}
