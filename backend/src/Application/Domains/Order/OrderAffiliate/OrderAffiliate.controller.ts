import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/@guards/jwt-auth.guard';
import { RoleGuard } from 'src/@guards/role.guard';
import { ROLE, RolesDecorator } from 'src/utils/role';
import { GenericPaginationDto } from 'src/utils/validators';
import { GetMyCurrentOrdersAsAffiliate } from './UseCases/GetMyCurrentOrdersAsAffiliate/GetMyCurrentOrdersAsAffiliate.usecase';
import { User } from '../../Auth/decorators/User.decorator';
import { PayloadType } from '#types';

@Controller({ path: 'order-affiliate', version: '1' })
export class OrderAffiliateController {
  constructor(
    private readonly getMyCurrentOrdersAsAffiliate: GetMyCurrentOrdersAsAffiliate,
  ) {}

  @Get()
  test() {
    return 'ORDER AFFILIATE CONTROLLER';
  }

  @Get('get-open-orders')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.AFFILIATE)
  getOpenOrders(
    @User() user: PayloadType,
    @Query() paginationDto: GenericPaginationDto,
  ) {
    return this.getMyCurrentOrdersAsAffiliate.execute(user, paginationDto);
  }
}
