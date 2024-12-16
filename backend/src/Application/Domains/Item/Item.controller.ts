import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateItem } from '../Item/UseCases/CreateItem/CreateItem.decorator';
import { CreateItemDto } from '../Item/UseCases/CreateItem/CrateItem.dto';
import { CreateItemService } from '../Item/UseCases/CreateItem/CreateItem.service';
import { JwtAuthGuard } from '../../../@guards/jwt-auth.guard';
import { RoleGuard } from '../../../@guards/role.guard';
import { User } from '../Auth/decorators/User.decorator';
import { ApiResponse, PayloadType } from '#types';
import { ROLE, RolesDecorator } from 'src/utils/role';
import { plainToInstance } from 'class-transformer';
import { ItemEntity } from 'src/Application/Entities/Item.entity';
import { AssignCategoryUseCase } from './UseCases/AssinCategory/AsssignCategory.usecase';
import { AssignCategoryDto } from './UseCases/AssinCategory/AssignCategory.dto';

@Controller({ path: 'item', version: '1' })
export class ItemController {
  constructor(
    private readonly createItemService: CreateItemService,
    private readonly assignCategoryUseCase: AssignCategoryUseCase,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.ADMIN, ROLE.AFFILIATE)
  async createProduct(
    @User() payload: PayloadType,
    @CreateItem() itemDto: CreateItemDto,
  ): Promise<ApiResponse<ItemEntity>> {
    const result = plainToInstance(
      ItemEntity,
      await this.createItemService.execute(
        { id: payload.sub, roles: payload.roles },
        itemDto,
      ),
      { exposeUnsetFields: false },
    );

    return {
      data: result,
      message: 'success',
      status: 201,
    };
  }

  @Post('assign-category')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.ADMIN, ROLE.AFFILIATE)
  async assignCategory(@Body() assignCategory: AssignCategoryDto) {
    const result = await this.assignCategoryUseCase.execute(assignCategory);

    return result;
  }
}
