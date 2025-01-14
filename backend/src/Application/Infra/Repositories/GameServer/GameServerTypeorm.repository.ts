import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  GameServerEntity,
  GameServerUniqueRefs,
  GameServerUpdateEntity,
} from 'src/Application/Entities/GameServer.entity';
import { Repository } from 'typeorm';
import { IGameServerRepositoryContract } from './IGameServer.repository-contract';
import { splitKeyAndValue } from '#utils';
import { PaginationResult } from '#types';
import { GenericPaginationDto } from 'src/utils/validators';
import { TABLE } from 'src/@metadata/tables';

@Injectable()
export class GameServerTypeOrmRepository implements IGameServerRepositoryContract
{
  constructor(
    @InjectRepository(GameServerEntity)
    private readonly gameServerRepository: Repository<GameServerEntity>,
  ) {}

  async create(entity: GameServerEntity): Promise<GameServerEntity> {
    try {
      const gameServerTypeOrmEntity =
        this.gameServerRepository.create(entity);
      const gameServerCreated = await this.gameServerRepository.save(
        gameServerTypeOrmEntity,
      );

      return gameServerCreated;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getBy(unqRef: GameServerUniqueRefs): Promise<GameServerEntity | null> {
    const [key, value] = splitKeyAndValue(unqRef);

    const gameServer = await this.gameServerRepository.findOneBy({
      [key]: value,
    });

    return gameServer ?? null;
  }

  async update(
    unqRef: GameServerUniqueRefs,
    updateEntity: GameServerUpdateEntity,
  ): Promise<GameServerEntity> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const gameServerToUpdate = await this.gameServerRepository.findOne({
        where: { [key]: value },
      });

      const newGameServer = Object.assign(gameServerToUpdate, {
        ...updateEntity,
      } as GameServerUpdateEntity);

      const gameServerUpdated = await this.gameServerRepository.save(
        newGameServer,
      );

      return gameServerUpdated;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async delete(unqRef: GameServerUniqueRefs): Promise<void> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      await this.gameServerRepository.delete({ [key]: value });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async softDelete(unqRef: GameServerUniqueRefs): Promise<'success' | 'fail'> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const gameServer = await this.gameServerRepository.findOne({
        where: { [key]: value },
      });

      const newGameServer = Object.assign(gameServer, {
        isDeleted: true,
      } as Partial<GameServerUpdateEntity>);

      await this.gameServerRepository.save(newGameServer);
      return 'success';
    } catch {
      return 'fail';
    }
  }

  async getAll(): Promise<GameServerEntity[]> {
    return this.gameServerRepository.find();
  }

  async getWithPaginationAndFilters(
    paginationDto: GenericPaginationDto,
  ): Promise<PaginationResult<GameServerEntity[]>> {
    const { page, limit, search, filters, order } = paginationDto;

    const queryBuilder = this.gameServerRepository.createQueryBuilder(
      TABLE.game_server,
    );

    if (search) {
      queryBuilder.andWhere(
        `SIMILARITY(${TABLE.game_server}.name, :search) > 0.3`,
        {
          search: `%${search}`,
        },
      );
    }

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        queryBuilder.andWhere(`${TABLE.game_server}.${key} = :${key}`, {
          [key]: value,
        });
      });
    }

    queryBuilder.orderBy(`${TABLE.game_server}.createdAt`, order || 'DESC');

    const [gameServers, total] = await queryBuilder
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();

    return {
      data: gameServers,
      page,
      limit,
      total,
      order,
    };
  }
}
