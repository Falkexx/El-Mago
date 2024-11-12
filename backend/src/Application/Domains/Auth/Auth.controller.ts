import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../User/dtos/CreateUser.dto';
import { AuthService } from './Auth.service';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  async signUp(@Body() userDto: CreateUserDto) {
    return this.authService.signUp(userDto);
  }
}
