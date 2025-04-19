import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateAffiliateDto } from '../Affiliate/dtos';
import { AffiliateService } from '../Affiliate/Affiliate.service';
import { ApiResponse } from '#types';
import { AffiliateEntity } from 'src/Application/Entities/Affiliate.entity';
import { env } from '#utils';
import { GenericPaginationDto } from 'src/utils/validators';
import { JwtAuthGuard } from '../../../@guards/jwt-auth.guard';
import { RoleGuard } from '../../../@guards/role.guard';
import { ROLE, RolesDecorator } from 'src/utils/role';

@Controller({ path: 'admin', version: '1' })
export class AdminController {
  constructor(private readonly affiliateService: AffiliateService) {}

  @Post('affiliate')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.ADMIN)
  async createAffiliate(
    @Body() affiliateDto: CreateAffiliateDto,
  ): Promise<ApiResponse<any>> {
    return {
      data: await this.affiliateService.create(affiliateDto),
      href:
        env.BACKEND_BASE_URL +
        env.BACKEND_PORT +
        '/v1/admin/affiliate/id/' +
        '',
      message: 'created',
      status: 201,
      meta: null,
    };
  }

  @Get('affiliate/id/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.ADMIN)
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
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.ADMIN)
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

  @Get('test')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.ADMIN)
  onlyAdminCanAccess() {
    return 'allow access';
  }
}
