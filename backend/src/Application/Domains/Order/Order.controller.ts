import { Controller, Post, UseGuards } from '@nestjs/common';
import { OrderService } from './Order.service';
import { CreateOrderUseCase } from './UseCases/CreateOrder/CreateOrder.usecase';
import { User } from '../Auth/decorators/User.decorator';
import { PayloadType } from '#types';
import { JwtAuthGuard } from 'src/@guards/jwt-auth.guard';
import { RoleGuard } from 'src/@guards/role.guard';
import { ROLE, RolesDecorator } from 'src/utils/role';

@Controller({ path: 'order', version: '1' })
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly createOrderUseCase: CreateOrderUseCase,
  ) {}

  @Post('pay-with-card')
  payWithCard() {
    return this.orderService.execute();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.ADMIN, ROLE.USER)
  createOrder(@User() payload: PayloadType) {
    return this.createOrderUseCase.execute(payload);
  }
}
