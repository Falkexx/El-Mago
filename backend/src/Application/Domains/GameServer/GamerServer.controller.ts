import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GameServerService } from './GameServer.service';
import { CreateGameServerDto } from './dtos/CreateGameServer.dto';
import { JwtAuthGuard } from 'src/@guards/jwt-auth.guard';
import { RoleGuard } from 'src/@guards/role.guard';
import { ROLE, RolesDecorator } from 'src/utils/role';
import { ApiResponse } from '#types';
import { GameServerEntity } from 'src/Application/Entities/GameServer.entity';
import { env } from '#utils';
import { GenericPaginationDto } from 'src/utils/validators';

@Controller({ path: 'game-server', version: '1' })
export class GamerServerController {
  constructor(private readonly gameServer: GameServerService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.ADMIN, ROLE.AFFILIATE)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() gameServerDto: CreateGameServerDto,
  ): Promise<ApiResponse<GameServerEntity>> {
    const result = await this.gameServer.create(gameServerDto);

    return {
      data: result,
      message: 'gamse server created successfully',
      status: 201,
      href: `${env.BACKEND_BASE_URL}:${env.BACKEND_PORT}/game-server/id/${result.id}`,
    };
  }

  @Get('id/:id')
  @HttpCode(HttpStatus.ACCEPTED)
  async getById(
    @Param('id') id: string,
  ): Promise<ApiResponse<GameServerEntity>> {
    if (!id) {
      throw new BadRequestException('require id to get game server');
    }

    const result = await this.gameServer.getGameServerById(id);

    return {
      data: result,
      message: 'successfully searched game server',
      status: 200,
    };
  }

  @Get('name/:name')
  @HttpCode(HttpStatus.ACCEPTED)
  async getByName(@Param('name') name: string) {
    if (!name) {
      throw new BadRequestException('require name to get game server');
    }

    const result = await this.gameServer.getGameServerByName(name);

    return {
      data: result,
      message: 'successfully searched game server',
      status: 200,
    };
  }

  @Get('many')
  @HttpCode(HttpStatus.ACCEPTED)
  async getManyGamServer(
    @Query() paginationDto: GenericPaginationDto,
  ): Promise<ApiResponse<GameServerEntity[]>> {
    const result = await this.gameServer.getManyGameServer(paginationDto);

    return {
      data: result.data,
      message: 'get many game server successfully',
      status: 200,
      meta: result.meta,
    };
  }
}
