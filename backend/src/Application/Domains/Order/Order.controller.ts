import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotImplementedException,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
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
import { AcceptOrderUseCase } from './UseCases/AcceptOrder/AcceptOrder.usecase';
import { AcceptOrderDto } from './UseCases/AcceptOrder/AcceptOrder.dto';
import { OrderEntity } from 'src/Application/Entities/Order.entity';
import { SendProofToOrderItemDto } from './UseCases/SendProofToOrderItem/SendProofToOrdemItem.dto';
import { SendProofToOrder } from './UseCases/SendProofToOrderItem/SendProofToOrderItem.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { SendProofToOrderItemUseCase } from './UseCases/SendProofToOrderItem/SendProofToOrderItem.usecase';
import { GetPendingOrdersUseCase } from './UseCases/GetPendingOrders/GetPendingOrders.usecase';

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
    private readonly addAffiliateOnOrderUseCase: AcceptOrderUseCase,
    private readonly sendProofToOrderItemUseCase: SendProofToOrderItemUseCase,
    private readonly getPendingOrdersUseCase: GetPendingOrdersUseCase,
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
    const orderCreated = await this.createOrderUseCase.execute(
      payload,
      createOrderDto,
    );

    return {
      data: orderCreated,
      message: 'created',
      status: 201,
      href: `${env.BACKEND_BASE_URL}:${env.BACKEND_PORT}/order/check/${orderCreated.id}`,
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

  @Get('affiliate/available-orders')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.AFFILIATE)
  getAvailableOrders(
    @User() user: PayloadType,
    @Query() paginationDto: GenericPaginationDto,
  ) {
    return this.getOrderAsAffiliateUseCase.execute(user);
  }

  @Get('affiliate/pending')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.AFFILIATE)
  getPendingOrders(@User() user: PayloadType) {
    return this.getPendingOrdersUseCase.execute(user);
  }

  @Post('affiliate/accept/:orderId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.AFFILIATE)
  async addAffiliateOnOrder(
    @User() payload: PayloadType,
    @Param() addAffiliateOnOrder: AcceptOrderDto,
  ): Promise<ApiResponse<any>> {
    const result = await this.addAffiliateOnOrderUseCase.execute(
      payload,
      addAffiliateOnOrder,
    );

    return {
      data: result,
      message: 'affiliate accept order successfully',
      status: 200,
    };
    throw new NotImplementedException('method not implemented');
  }

  @Post('send-proof-delivery-for-order')
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.AFFILIATE)
  sendProofImageDto(
    @User() payload: PayloadType,
    @SendProofToOrder() sendProofDto: SendProofToOrderItemDto,
  ) {
    throw new InternalServerErrorException('need implement this method');
  }
}
