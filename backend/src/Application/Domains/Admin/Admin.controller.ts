import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateAffiliateDto } from '../Affiliate/dtos';
import { AffiliateService } from '../Affiliate/Affiliate.service';
import { ApiResponse } from '#types';
import { AffiliateEntity } from 'src/Application/Entities/Affiliate.entity';
import { env } from '#utils';
import { plainToInstance } from 'class-transformer';
import { GenericPaginationDto } from 'src/utils/validators';

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

  // GET /my-entities?page=1&limit=5&search=test&filters[status]=active&filters[category]=tech

  @Get('affiliate/many')
  async getMany(
    @Query() paginationDto: GenericPaginationDto,
  ): Promise<ApiResponse<AffiliateEntity[]>> {
    const result =
      await this.affiliateService.findWithPaginationAndFilters(paginationDto);

    return {
      data: result.data,
      message: 'success',
      status: 200,
      meta: {
        page: result.page,
        per_page: result.limit,
        total: result.total,
        order: result.order ?? 'DESC',
      },
    };
  }
}
