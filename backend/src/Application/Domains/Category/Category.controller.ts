import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CategoryService } from './Category.service';
import { ApiResponse, PayloadType } from '#types';
import { CategoryEntity } from 'src/Application/Entities/Category.entity';
import { User } from '../Auth/decorators/User.decorator';
import { CreateCategoryDto } from './dtos/CreateCategory.dto';
import { JwtAuthGuard } from '../Auth/guards/jwt-auth.guard';
import { RoleGuard } from '../Auth/guards/role.guard';
import { ROLE, RolesDecorator } from 'src/utils/role';

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
}
