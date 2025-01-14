import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ReqAffiliateDto } from './UseCases/ReqAffiliate/ReqAffiliate.dto';
import { ReqAffiliateUseCase } from './UseCases/ReqAffiliate/ReqAffiliate.usecase';
import { User } from '../Auth/decorators/User.decorator';
import { ApiResponse, PayloadType } from '#types';
import { JwtAuthGuard } from 'src/@guards/jwt-auth.guard';
import { RoleGuard } from 'src/@guards/role.guard';
import { ROLE, RolesDecorator } from 'src/utils/role';
import { plainToInstance } from 'class-transformer';
import { RequestAffiliateEntity } from 'src/Application/Entities/Request-Affiliate.entity';
import { GenericPaginationDto } from 'src/utils/validators';
import { ListAffiliatesOnHoldUseCase } from './UseCases/ListAffiliatesOnHold/ListAffiliatesOnHold.usecase';

@Controller({ path: 'affiliate', version: '1' })
export class AffiliateController {
  constructor(
    private readonly reqAffiliateUseCase: ReqAffiliateUseCase,
    private readonly listAffiliatesOnHoldUseCase: ListAffiliatesOnHoldUseCase,
  ) {}

  @Post('/request-to-become')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.USER)
  async reqAffiliate(
    @User() payload: PayloadType,
    @Body() requestAffiliateDto: ReqAffiliateDto,
  ): Promise<ApiResponse<RequestAffiliateEntity>> {
    const result = await this.reqAffiliateUseCase.execute(
      payload,
      requestAffiliateDto,
    );

    const reqAffiliateSanitized = await plainToInstance(
      RequestAffiliateEntity,
      result,
    );

    return {
      data: reqAffiliateSanitized,
      status: 200,
      message: 'CREATED',
      href: null,
    };
  }

  @Get('/list-affiliates-on-hold')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.ADMIN)
  async listAffiliatesOnHold(
    @Query() pagination: GenericPaginationDto,
  ): Promise<ApiResponse<RequestAffiliateEntity[]>> {
    const listOfAffiliatesOnHold =
      await this.listAffiliatesOnHoldUseCase.execute(pagination);

    return {
      data: listOfAffiliatesOnHold.data,
      message: 'SUCCESS',
      status: 200,
      meta: {
        order: listOfAffiliatesOnHold.order,
        page: listOfAffiliatesOnHold.page,
        per_page: listOfAffiliatesOnHold.limit,
        total: listOfAffiliatesOnHold.total,
      },
    };
  }
}
