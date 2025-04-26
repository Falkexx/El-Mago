import {
  Injectable,
  InternalServerErrorException,
  NotImplementedException,
} from '@nestjs/common';
import { IGameServerRepositoryContract } from './IGameServer.repository-contract';
import {
  GameServerEntity,
  GameServerUniqueRefs,
} from 'src/Application/Entities/GameServer.entity';
import { GenericPaginationDto } from 'src/utils/validators';
import { QueryRunner } from 'typeorm';
import { SearchBuilderService } from '../SearchBuilder.service';
import { TABLE } from 'src/@metadata/tables';
import { splitKeyAndValue } from '#utils';

@Injectable()
export class GameServerTypeOrmRepository
  implements IGameServerRepositoryContract
{
  constructor(private readonly searchBuilder: SearchBuilderService) {}

  async create(
    entity: GameServerEntity,
    trx: QueryRunner,
  ): Promise<GameServerEntity> {
    try {
      const result = await trx.manager
        .createQueryBuilder()
        .insert()
        .into(GameServerEntity)
        .values(entity)
        .returning('*')
        .execute();

      return result.raw[0];
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getBy(
    unqRef: GameServerUniqueRefs,
    trx: QueryRunner,
  ): Promise<GameServerEntity> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const result = await trx.manager
        .createQueryBuilder()
        .select()
        .from(GameServerEntity, TABLE.game_server)
        .where(`"${TABLE.game_server}"."${key}" = :value`, { value })
        .getOne();

      return result ?? null;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async update(
    unqRef: GameServerUniqueRefs,
    updateEntity: Partial<GameServerEntity>,
    trx: QueryRunner,
  ): Promise<GameServerEntity> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const result = await trx.manager
        .createQueryBuilder()
        .update()
        .set(GameServerEntity)
        .where(`"${TABLE.game_server}"."${key}" = :value`, { value })
        .returning('*')
        .execute();

      if (result.affected === 0) {
        throw new NotImplementedException(
          `gamer server not found at ${unqRef}`,
        );
      }

      return result.raw[0];
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async delete(unqRef: GameServerUniqueRefs, trx: QueryRunner): Promise<void> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const result = await trx.manager
        .createQueryBuilder()
        .delete()
        .from(GameServerEntity, TABLE.game_server)
        .where(`"${TABLE.game_server}"."${key}" = :value`, { value })
        .execute();

      if (result.affected === 0) {
        throw new NotImplementedException(
          `gamer server not found at ${unqRef}`,
        );
      }
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async softDelete(
    unqRef: GameServerUniqueRefs,
    trx: QueryRunner,
  ): Promise<GameServerEntity> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const result = await trx.manager
        .createQueryBuilder()
        .update()
        .set(TABLE.game_server)
        .where(`"${TABLE.game_server}"."${key}" = :value`, { value })
        .returning('*')
        .execute();

      if (result.affected === 0) {
        throw new NotImplementedException(
          `gamer server not found at ${unqRef}`,
        );
      }

      return result.raw[0];
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getAll(trx: QueryRunner): Promise<GameServerEntity[]> {
    try {
      const result = trx.manager
        .createQueryBuilder()
        .select()
        .from(GameServerEntity, TABLE.game_server)
        .getMany();

      return result;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getWithPaginationAndFilters(
    paginationDto: GenericPaginationDto,
    trx: QueryRunner,
  ) {
    try {
      const result = await this.searchBuilder.search(
        paginationDto,
        TABLE.game_server,
        trx.manager.createQueryBuilder(),
      );

      return result;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }
}
