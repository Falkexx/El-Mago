import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CategoryService } from './Category.service';
import { ApiResponse, PayloadType } from '#types';
import { CategoryEntity } from 'src/Application/Entities/Category.entity';
import { User } from '../Auth/decorators/User.decorator';
import { CreateCategoryDto } from './dtos/CreateCategory.dto';
import { JwtAuthGuard } from '../Auth/guards/jwt-auth.guard';
import { RoleGuard } from '../Auth/guards/role.guard';
import { ROLE, RolesDecorator } from 'src/utils/role';
import { GenericPaginationDto } from 'src/utils/validators';

@Controller({ path: 'category', version: '1' })
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.ADMIN)
  async create(
    @User() payload: PayloadType,
    @Body() categoryDto: CreateCategoryDto,
  ): Promise<ApiResponse<CategoryEntity>> {
    const result = await this.categoryService.create(
      { id: payload.sub, roles: payload.roles },
      categoryDto,
    );

    return {
      data: result,
      message: 'success',
      status: 201,
      href: 'not implemented',
    };
  }

  @Get('many')
  async many(
    @Query() paginationDto: GenericPaginationDto,
  ): Promise<ApiResponse<CategoryEntity[]>> {
    const result =
      await this.categoryService.findWithPaginationAndFilters(paginationDto);
    return {
      data: result.data,
      message: 'success',
      status: 200,
      href: '',
      meta: {
        order: result.order,
        page: result.page,
        per_page: result.limit,
        total: result.total,
      },
    };
  }
}
