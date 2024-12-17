import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { UpdateUserUseCase } from './UseCases/UpdateUser/UpdateUser.usecase';
import { UpdateUserDto } from './UseCases/UpdateUser/UpdateUser.dto';
import { JwtAuthGuard } from '../../../@guards/jwt-auth.guard';
import { User } from '../Auth/decorators/User.decorator';
import { PayloadType } from '#types';
import { plainToInstance } from 'class-transformer';
import { UserEntity } from 'src/Application/Entities/User.entity';
import { RoleGuard } from '../../../@guards/role.guard';
import { ROLE, RolesDecorator } from 'src/utils/role';

@Controller({ path: 'user', version: '1' })
export class UserController {
  constructor(private readonly updateUserUseCase: UpdateUserUseCase) {}

  @Patch()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.USER)
  async updateUser(@User() user: PayloadType, @Body() userDto: UpdateUserDto) {
    const result = plainToInstance(
      UserEntity,
      await this.updateUserUseCase.execute(user, userDto),
      { exposeUnsetFields: false },
    );

    return result;
  }
}
