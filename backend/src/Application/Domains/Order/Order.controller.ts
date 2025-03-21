import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './Order.service';
import { CreateOrderUseCase } from './UseCases/CreateOrder/CreateOrder.usecase';
import { User } from '../Auth/decorators/User.decorator';
import { PayloadType } from '#types';
import { JwtAuthGuard } from 'src/@guards/jwt-auth.guard';
import { RoleGuard } from 'src/@guards/role.guard';
import { ROLE, RolesDecorator } from 'src/utils/role';
import { PayOrderUseCase } from './UseCases/PayOrder/PayOrder.usecase';
import { GetOrderByAuthUseCase } from './UseCases/GetOrdersByAuth/GetOrderByAuth.usecase';
import { GenericPaginationDto } from 'src/utils/validators';
import { GetOrderByIdUseCase } from './UseCases/GetOrderById/GetOrderById.usecase';
import { CreateOrderDto } from './UseCases/CreateOrder/CreateOrder.dto';

@Controller({ path: 'order', version: '1' })
export class OrderController {
  constructor(
    // service
    private readonly orderService: OrderService,

    // use cases
    private readonly getOrdersByAuth: GetOrderByAuthUseCase,
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly payOrderUseCase: PayOrderUseCase,
    private readonly getOrderById: GetOrderByIdUseCase,
  ) {}

  @Get('many')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.ADMIN, ROLE.USER, ROLE.AFFILIATE)
  getAllOrders(
    @User() payload: PayloadType,
    @Query() pagination: GenericPaginationDto,
  ) {
    return this.getOrdersByAuth.execute(payload, pagination);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.ADMIN, ROLE.USER)
  createOrder(
    @User() payload: PayloadType,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.createOrderUseCase.execute(payload, createOrderDto);
  }

  @Post('pay/:orderId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.ADMIN, ROLE.USER)
  payOrder(@User() payload: PayloadType, @Param('orderId') orderId: string) {
    return this.payOrderUseCase.execute(payload, { orderId });
  }

  @Get('check/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.ADMIN, ROLE.USER, ROLE.AFFILIATE)
  get(@User() payload: PayloadType, @Param('id') orderId: string) {
    return this.getOrderById.execute(payload, orderId);
  }
}
