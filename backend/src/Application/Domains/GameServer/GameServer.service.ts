import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { KEY_INJECTION } from 'src/@metadata/keys';
import { IGameServerRepositoryContract } from 'src/Application/Infra/Repositories/GameServerRepository/IGameServer.repository-contract';
import { CreateGameServerDto } from './dtos/CreateGameServer.dto';
import { DataSource } from 'typeorm';
import { generateShortId } from '#utils';
import { GenericPaginationDto } from 'src/utils/validators';
import { Omics } from 'aws-sdk';

@Injectable()
export class GameServerService {
  constructor(
    @Inject(KEY_INJECTION.GAME_SERVER_REPOSITORY)
    private readonly gameServerRepository: IGameServerRepositoryContract,

    private readonly dataSource: DataSource,
  ) {}

  async create(gameServerDto: CreateGameServerDto) {
    const trx = this.dataSource.createQueryRunner();

    try {
      await trx.startTransaction();

      const gameServerAlreadyExist = await this.gameServerRepository.getBy(
        {
          name: gameServerDto.name,
        },
        trx,
      );

      console.log(gameServerAlreadyExist);

      if (gameServerAlreadyExist) {
        throw new ConflictException('game server already exist');
      }

      const gameServerCreated = await this.gameServerRepository.create(
        {
          id: generateShortId(12),
          name: gameServerDto.name,
          image: gameServerDto.image ?? null,
          description: gameServerDto.description ?? null,
          deletedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        trx,
      );

      await trx.commitTransaction();

      return gameServerCreated;
    } catch (e) {
      await trx.rollbackTransaction();
      throw e;
    } finally {
      await trx.release();
    }
  }

  async getGameServerById(id: string) {
    const trx = this.dataSource.createQueryRunner();

    try {
      await trx.startTransaction();

      const gameServer = await this.gameServerRepository.getBy({ id }, trx);

      if (gameServer) {
        throw new NotFoundException('game server not found');
      }

      await trx.commitTransaction();

      return gameServer;
    } catch (e) {
      await trx.rollbackTransaction();
      throw e;
    } finally {
      await trx.release();
    }
  }

  async getGameServerByName(name: string) {
    const trx = this.dataSource.createQueryRunner();

    try {
      await trx.startTransaction();

      const gameServer = await this.gameServerRepository.getBy({ name }, trx);

      if (gameServer) {
        throw new NotFoundException('game server not found');
      }

      await trx.commitTransaction();

      return gameServer;
    } catch (e) {
      await trx.rollbackTransaction();
      throw e;
    } finally {
      await trx.release();
    }
  }

  async getManyGameServer(paginationDto: GenericPaginationDto) {
    const trx = this.dataSource.createQueryRunner();

    try {
      await trx.startTransaction();

      const result =
        await this.gameServerRepository.getWithPaginationAndFilters(
          paginationDto,
          trx,
        );

      await trx.commitTransaction();

      return result;
    } catch (e) {
      await trx.rollbackTransaction();
      throw e;
    } finally {
      await trx.release();
    }
  }
}
