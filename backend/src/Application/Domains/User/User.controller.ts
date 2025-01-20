import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { UpdateUserUseCase } from './UseCases/UpdateUser/UpdateUser.usecase';
import { UpdateUserDto } from './UseCases/UpdateUser/UpdateUser.dto';
import { JwtAuthGuard } from '../../../@guards/jwt-auth.guard';
import { User } from '../Auth/decorators/User.decorator';
import { PayloadType } from '#types';
import { plainToInstance } from 'class-transformer';
import { UserEntity } from 'src/Application/Entities/User.entity';
import { RoleGuard } from '../../../@guards/role.guard';
import { ROLE, RolesDecorator } from 'src/utils/role';
import { GetCartUseCase } from './UseCases/GetCart/GetCart.usecase';
import { PutItemInCartDto } from './UseCases/PutItemInCart/PutItemInCart.dto';
import { PutItemInCartUseCase } from './UseCases/PutItemInCart/PutItemInCart.usecase';

@Controller({ path: 'user', version: '1' })
export class UserController {
  constructor(
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly getCartUseCase: GetCartUseCase,
    private readonly putItemInCartUseCase: PutItemInCartUseCase,
  ) {}

  @Patch()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.USER, ROLE.AFFILIATE, ROLE.ADMIN)
  async updateUser(@User() user: PayloadType, @Body() userDto: UpdateUserDto) {
    const result = plainToInstance(
      UserEntity,
      await this.updateUserUseCase.execute(user, userDto),
      { exposeUnsetFields: false },
    );

    return result;
  }

  @Get('cart')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.ADMIN, ROLE.USER)
  async getCart(@User() payload: PayloadType) {
    const result = await this.getCartUseCase.execute(payload);

    return result;
  }

  @Post('cart')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.ADMIN, ROLE.USER)
  async addItemInCart(
    @User() payload: PayloadType,
    @Body() putDto: PutItemInCartDto,
  ) {
    return this.putItemInCartUseCase.execute(payload, putDto);
  }
}
