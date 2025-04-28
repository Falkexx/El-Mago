import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CaryRunService } from './CaryRun.service';
import { CreateCaryRunDto } from './Dtos/CreateCaryRun.dtos';
import { JwtAuthGuard } from 'src/@guards/jwt-auth.guard';
import { RoleGuard } from 'src/@guards/role.guard';
import { ROLE } from 'src/@metadata/roles';
import { RolesDecorator } from 'src/utils/role';
import { User } from '../Auth/decorators/User.decorator';
import { ApiResponse, PayloadType } from '#types';
import { CaryRunEntity } from 'src/Application/Entities/CaryRun/CaryRun.entity';
import { CreateCaryRunCategoryDto } from './Dtos/CreateCaryRunCatetory.dto';
import { CaryRunCategoryEntity } from 'src/Application/Entities/CaryRun/CaryRunCategory.entity';
import { GenericPaginationDto } from 'src/utils/validators';

@Controller({ path: 'cary-run', version: '1' })
export class CaryRunController {
  constructor(private readonly caryRunService: CaryRunService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.AFFILIATE, ROLE.ADMIN)
  async create(
    @User() user: PayloadType,
    @Body() createQueryRun: CreateCaryRunDto,
  ): Promise<ApiResponse<CaryRunEntity>> {
    const result = await this.caryRunService.create(user, createQueryRun);

    return {
      data: result,
      message: 'success',
      status: 201,
      href: 'require implement',
    };
  }

  @Get('get-many')
  async getManyCaryRun(
    @Query() paginationDto: GenericPaginationDto,
  ): Promise<ApiResponse<CaryRunEntity[]>> {
    const result = await this.caryRunService.getMany(paginationDto);

    return {
      data: result.data,
      message: 'success',
      status: 200,
      meta: {
        limit: result.meta.limit,
        order: result.meta.order,
        page: result.meta.page,
        remainingPages: result.meta.remainingPages,
        total: result.meta.total,
        totalPages: result.meta.totalPages,
      },
    };
  }

  @Post('category')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.ADMIN, ROLE.AFFILIATE)
  async createCategory(
    @Body() categoryDto: CreateCaryRunCategoryDto,
  ): Promise<ApiResponse<CaryRunCategoryEntity>> {
    const result = await this.caryRunService.createCategory(categoryDto);

    return {
      data: result,
      message: 'success',
      status: 201,
    };
  }

  @Get('categories/get-many')
  async searchCategories(
    @Query() paginationDto: GenericPaginationDto,
  ): Promise<ApiResponse<CaryRunCategoryEntity[]>> {
    const result = await this.caryRunService.getManyCategories(paginationDto);

    return {
      data: result.data,
      message: 'success',
      status: 200,
      meta: result.meta,
    };
  }
}
