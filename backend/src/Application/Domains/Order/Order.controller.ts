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
import { ApiResponse, PayloadType } from '#types';
import { JwtAuthGuard } from 'src/@guards/jwt-auth.guard';
import { RoleGuard } from 'src/@guards/role.guard';
import { ROLE, RolesDecorator } from 'src/utils/role';
import { PayOrderUseCase } from './UseCases/PayOrder/PayOrder.usecase';
import { GetOrderByAuthUseCase } from './UseCases/GetOrdersByAuth/GetOrderByAuth.usecase';
import { GenericPaginationDto } from 'src/utils/validators';
import { GetOrderByIdUseCase } from './UseCases/GetOrderById/GetOrderById.usecase';
import { CreateOrderDto } from './UseCases/CreateOrder/CreateOrder.dto';
import { GetOrderAsAffiliateUseCase } from './UseCases/GetOrderAsAffiliate/GetOrderAsAffiliate.usecase';
import { plainToInstance } from 'class-transformer';
import { UserEntity } from 'src/Application/Entities/User.entity';
import { env } from '#utils';
import { AddAffiliateOnOrderUseCase } from './UseCases/AddAffiliateOnOrder/AddAffiliateOnOrder.usecase';
import { AddAffiliateOnOrderDto } from './UseCases/AddAffiliateOnOrder/AddAffiliateOnOrder.dto';
import { OrderEntity } from 'src/Application/Entities/Order.entity';

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
    private readonly getOrderAsAffiliateUseCase: GetOrderAsAffiliateUseCase,
    private readonly addAffiliateOnOrderUseCase: AddAffiliateOnOrderUseCase,
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
  async createOrder(
    @User() payload: PayloadType,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<ApiResponse<any>> {
    const result = await this.createOrderUseCase.execute(
      payload,
      createOrderDto,
    );

    const user = plainToInstance(UserEntity, result.user);

    return {
      data: {
        ...result,
        user,
      },
      message: 'created',
      status: 201,
      href: `${env.BACKEND_BASE_URL}:${env.BACKEND_PORT}/order/check/${result.id}`,
    };
  }

  @Post('pay/:orderId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.ADMIN, ROLE.USER)
  async payOrder(
    @User() payload: PayloadType,
    @Param('orderId') orderId: string,
  ) {
    const result = await this.payOrderUseCase.execute(payload, { orderId });

    const user = plainToInstance(UserEntity, result.order.user);
    return {
      data: {
        ...result,
        user,
      },

      href: `${env.BACKEND_BASE_URL}:${env.BACKEND_PORT}/order/check/${result.order.id}`,
    };
  }

  @Get('check/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.ADMIN, ROLE.USER, ROLE.AFFILIATE)
  get(@User() payload: PayloadType, @Param('id') orderId: string) {
    return this.getOrderById.execute(payload, orderId);
  }

  @Get('as-affiliate')
  getOrderAsAffiliate() {
    return this.getOrderAsAffiliateUseCase.execute();
  }

  @Post('accept/:orderId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.AFFILIATE)
  async addAffiliateOnOrder(
    @User() payload: PayloadType,
    @Param() addAffiliateOnOrder: AddAffiliateOnOrderDto,
  ): Promise<ApiResponse<OrderEntity>> {
    const result = await this.addAffiliateOnOrderUseCase.execute(
      payload,
      addAffiliateOnOrder,
    );

    return {
      data: result,
      message: 'affiliate accept order successfuly',
      status: 200,
    };
  }
}
