import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { UpdateUserService } from './UpdateUser/UpdateUser.service';
import { UpdateUserDto } from './UpdateUser/UpdateUser.dto';
import { JwtAuthGuard } from '../Auth/guards/jwt-auth.guard';
import { User } from '../Auth/decorators/User.decorator';
import { PayloadType } from '#types';
import { plainToInstance } from 'class-transformer';
import { UserEntity } from 'src/Application/Entities/User.entity';

@Controller({ path: 'user', version: '1' })
export class UserController {
  constructor(private readonly updateUserService: UpdateUserService) {}

  @Patch()
  @UseGuards(JwtAuthGuard)
  async updateUser(@User() user: PayloadType, @Body() userDto: UpdateUserDto) {
    const result = plainToInstance(
      UserEntity,
      await this.updateUserService.execute(user, userDto),
      { exposeUnsetFields: false },
    );

    return result;
  }
}
