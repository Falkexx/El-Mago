import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
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
import { ApproveAffiliateOnWaitingListDto } from './UseCases/ApproveAffiliateOnWaitingList/ApproveAffiliateOnWaitingList.dto';
import {
  ApproveAffiliateOnWaitingListUseCase,
  ApproveAffiliateOnWaitingListUseCaseResult,
} from './UseCases/ApproveAffiliateOnWaitingList/ApproveAffiliateOnWaitingList.usecase';
import { RefuseAffiliateOnWaitingListUseCase } from './UseCases/RefuseAffiliateOnWaitingList/RefuseAffiliateOnWaitingList.usecase';
import { RefuseAffiliateOnWaitingListDto } from './UseCases/RefuseAffiliateOnWaitingList/RefuseAffiliateOnWaitingList.dto';

@Controller({ path: 'affiliate', version: '1' })
export class AffiliateController {
  constructor(
    private readonly reqAffiliateUseCase: ReqAffiliateUseCase,
    private readonly listAffiliatesOnHoldUseCase: ListAffiliatesOnHoldUseCase,
    private readonly approveAffiliateOnWaitingListUseCase: ApproveAffiliateOnWaitingListUseCase,
    private readonly refuseAffiliateOnWaitingListUseCase: RefuseAffiliateOnWaitingListUseCase,
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

  @Post('approve-affiliate-on-hold/:email')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.ADMIN)
  async approveAffiliateOnHold(
    @Param() { email }: ApproveAffiliateOnWaitingListDto,
  ): Promise<ApiResponse<ApproveAffiliateOnWaitingListUseCaseResult>> {
    const result = await this.approveAffiliateOnWaitingListUseCase.execute({
      email,
    });

    return {
      data: result,
      message: 'SUCCESS',
      status: 201,
      href: null,
    };
  }

  @Post('refuse-affiliate-on-hold/:email')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.ADMIN)
  async refuseAffiliateOnHold(
    @Param() { email }: RefuseAffiliateOnWaitingListDto,
  ) {
    const result = await this.refuseAffiliateOnWaitingListUseCase.execute({
      email,
    });

    return result;
  }
}
