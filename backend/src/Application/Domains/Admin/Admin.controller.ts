import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
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
      href:
        env.BACKEND_BASE_URL +
        env.BACKEND_PORT +
        '/v1/admin/affiliate/id/' +
        result.id,
      message: 'created',
      status: 201,
      meta: null,
    };
  }

  @Get('affiliate/id/:id')
  async getAffiliate(
    @Param('id') id: string,
  ): Promise<ApiResponse<AffiliateEntity | null>> {
    const result = await this.affiliateService.getById(id);

    if (!result) {
      throw new NotFoundException('affiliate not found');
    }

    return {
      data: result,
      message: 'affiliate',
      status: result ? 200 : 404,
      href:
        env.BACKEND_BASE_URL +
        env.BACKEND_PORT +
        '/v1/admin/affiliate/id/' +
        result.id,
      meta: null,
    };
  }
}
