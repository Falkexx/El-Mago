import { Body, Controller, Post } from '@nestjs/common';
import { CreateAffiliateDto } from '../Affiliate/dtos';
import { AffiliateService } from '../Affiliate/Affiliate.service';
import { ApiResponse } from '#types';
import { AffiliateEntity } from 'src/Application/Entities/Affiliate.entity';
import { env } from '#utils';
import { plainToInstance } from 'class-transformer';

@Controller({ path: 'admin', version: '1' })
export class AdminController {
  constructor(private readonly affiliateService: AffiliateService) {}

  @Post('affiliate')
  async createAffiliate(
    @Body() affiliateDto: CreateAffiliateDto,
  ): Promise<ApiResponse<AffiliateEntity>> {
    const result = plainToInstance(
      AffiliateEntity,
      await this.affiliateService.create(affiliateDto),
      { exposeUnsetFields: true },
    );

    return {
      data: result,
      href: env.BACKEND_BASE_URL + env.BACKEND_PORT + '/admin/affiliate',
      message: 'created',
      status: 201,
      meta: null,
    };
  }
}
