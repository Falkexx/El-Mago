import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ReqAffiliateDto } from './ReqAffiliate/ReqAffiliate.dto';
import { ReqAffiliateUseCase } from './ReqAffiliate/ReqAffiliate.usecase';
import { User } from '../Auth/decorators/User.decorator';
import { ApiResponse, PayloadType } from '#types';
import { JwtAuthGuard } from 'src/@guards/jwt-auth.guard';
import { RoleGuard } from 'src/@guards/role.guard';
import { ROLE, RolesDecorator } from 'src/utils/role';
import { plainToInstance } from 'class-transformer';
import { RequestAffiliateEntity } from 'src/Application/Entities/Request-Affiliate.entity';

@Controller({ path: 'affiliate', version: '1' })
export class AffiliateController {
  constructor(private readonly reqAffiliateUseCase: ReqAffiliateUseCase) {}

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
}
