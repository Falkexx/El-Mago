import {
  RequestAffiliateEntity,
  RequestAffiliateUnqRef,
  RequestAffiliateUpdateEntity,
} from 'src/Application/Entities/Request-Affiliate.entity';
import { GenericPaginationDto } from 'src/utils/validators';
import { IRequestAffiliateRepositoryContract } from './IRequestAffiliate.repository-contract';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { splitKeyAndValue } from '#utils';
import { SearchBuilderService } from '../SearchBuilder.service';
import { TABLE } from 'src/@metadata/tables';
import { SearchBuilderResult } from '#types';

@Injectable()
export class RequestAffiliateTypeOrmRepository
  implements IRequestAffiliateRepositoryContract
{
  constructor(private readonly searchBuilder: SearchBuilderService) {}

  async create(
    entity: RequestAffiliateEntity,
    trx: QueryRunner,
  ): Promise<RequestAffiliateEntity> {
    try {
      const result = await trx.manager
        .createQueryBuilder()
        .insert()
        .into(RequestAffiliateEntity)
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
    unqRef: RequestAffiliateUnqRef,
    trx: QueryRunner,
  ): Promise<RequestAffiliateEntity> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const result = await trx.manager
        .createQueryBuilder()
        .select('*')
        .from(RequestAffiliateEntity, TABLE.affiliate_queue)
        .where(`${TABLE.affiliate_queue}."${key}" = :${value}`, { value })
        .andWhere(`${TABLE.affiliate_queue}."deletedAt" IS NULL`)
        .getOne();

      return result ?? null;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async update(
    unqRef: RequestAffiliateUnqRef,
    updateEntity: RequestAffiliateUpdateEntity,
    trx: QueryRunner,
  ): Promise<RequestAffiliateEntity> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const result = await trx.manager
        .createQueryBuilder()
        .update(RequestAffiliateEntity)
        .set(updateEntity)
        .where(`${TABLE.affiliate_queue}."${key}" = :${value}`, { value })
        .andWhere(`${TABLE.affiliate_queue}."deletedAt" IS NULL`)
        .returning('*')
        .execute();

      if (result.affected === 0) {
        throw new Error(
          `rows affected is 0 when update affiliate with ${key}: ${value}`,
        );
      }

      return result.raw[0];
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async delete(
    unqRef: RequestAffiliateUnqRef,
    trx: QueryRunner,
  ): Promise<void> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const result = await trx.manager
        .createQueryBuilder()
        .delete()
        .from(RequestAffiliateEntity, TABLE.affiliate_queue)
        .where(`"${TABLE.affiliate_queue}"."${key}" = :${value}`, { value })
        .execute();

      if (result.affected === 0) {
        throw new Error(
          `error when delete affiliate in queue with ${key}: ${value}`,
        );
      }
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async softDelete(
    unqRef: RequestAffiliateUnqRef,
    trx: QueryRunner,
  ): Promise<RequestAffiliateEntity> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const result = await trx.manager
        .createQueryBuilder()
        .update(RequestAffiliateEntity)
        .set({
          deletedAt: new Date(),
        } as RequestAffiliateEntity)
        .where(`"${TABLE.affiliate_queue}."${key} = :${value}`, { value })
        .andWhere(`"${TABLE.affiliate_queue}."deletedAt" IS NULL`)
        .execute();

      if (result.affected === 0) {
        throw new Error(`affected row is 0 when ${key}: ${value}`);
      }

      return result.raw[0];
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getAll(trx: QueryRunner): Promise<RequestAffiliateEntity[]> {
    try {
      const result = await trx.manager
        .createQueryBuilder()
        .select('*')
        .from(RequestAffiliateEntity, TABLE.affiliate_queue)
        .where(`"${TABLE.affiliate_queue}."deletedAt" IS NULL"`)
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
  ): Promise<SearchBuilderResult<RequestAffiliateEntity>> {
    try {
      const queryBuilder = trx.manager.createQueryBuilder(
        RequestAffiliateEntity,
        TABLE.affiliate_queue,
      );

      return this.searchBuilder.search(
        paginationDto,
        RequestAffiliateEntity,
        TABLE.affiliate_queue,
        queryBuilder,
        { createdField: 'createdAt', searchField: 'name' },
      );
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }
}
