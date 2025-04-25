import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  AffiliateEntity,
  AffiliateEntityUniqueRefs,
  AffiliateUpdateEntity,
} from 'src/Application/Entities/Affiliate.entity';
import { QueryRunner } from 'typeorm';
import { IAffiliateRepositoryContract } from './IAffiliate.repository-contract';
import { PaginationResult } from '#types';
import { splitKeyAndValue } from '#utils';
import { GenericPaginationDto } from 'src/utils/validators';
import { TABLE } from 'src/@metadata/tables';

@Injectable()
export class AffiliateTypeOrmRepository
  implements IAffiliateRepositoryContract
{
  async create(
    entity: AffiliateEntity,
    trx?: QueryRunner,
  ): Promise<AffiliateEntity> {
    try {
      const result = await trx.manager
        .createQueryBuilder()
        .insert()
        .into(AffiliateEntity)
        .values(entity)
        .returning('*')
        .execute();

      return result.raw[0];
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
  async getBy(
    unqRef: AffiliateEntityUniqueRefs,
    trx: QueryRunner,
  ): Promise<AffiliateEntity | null> {
    try {
      const [key, value] = splitKeyAndValue(unqRef);

      const affiliate = await trx.manager
        .createQueryBuilder()
        .select(TABLE.affiliate)
        .from(AffiliateEntity, TABLE.affiliate)
        .where(`"${TABLE.affiliate}"."${key}" = :value`, { value })
        .andWhere(`"${TABLE.affiliate}"."deletedAt" IS NULL`)
        .getOne();

      return affiliate ?? null;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async update(
    unqRef: AffiliateEntityUniqueRefs,
    updateEntity: AffiliateUpdateEntity,
    trx: QueryRunner,
  ): Promise<AffiliateEntity> {
    try {
      const [key, value] = splitKeyAndValue(unqRef);

      const result = await trx.manager
        .createQueryBuilder()
        .update(AffiliateEntity)
        .set(updateEntity)
        .where(`"${TABLE.affiliate}"."${key}" = :value`, { value })
        .andWhere(`"${TABLE.affiliate}"."deletedAt" IS NULL`)
        .returning('*')
        .execute();

      if (!result.raw[0]) {
        throw new InternalServerErrorException(
          'Affiliate not found or deleted',
        );
      }

      return result.raw[0];
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async delete(
    unqRef: AffiliateEntityUniqueRefs,
    trx: QueryRunner,
  ): Promise<void> {
    try {
      const [key, value] = splitKeyAndValue(unqRef);

      const result = await trx.manager
        .createQueryBuilder()
        .delete()
        .from(AffiliateEntity)
        .where(`"${TABLE.affiliate}"."${key}" = :value`, { value })
        .andWhere(`"${TABLE.affiliate}"."deletedAt" IS NULL`)
        .execute();

      if (result.affected === 0) {
        throw new InternalServerErrorException(
          'Affiliate not found or deleted',
        );
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async softDelete(
    unqRef: AffiliateEntityUniqueRefs,
    trx: QueryRunner,
  ): Promise<AffiliateEntity> {
    try {
      const [key, value] = splitKeyAndValue(unqRef);

      const result = await trx.manager
        .createQueryBuilder()
        .update(AffiliateEntity)
        .set({ deletedAt: new Date() })
        .where(`"${TABLE.affiliate}"."${key}" = :value`, { value })
        .andWhere(`"${TABLE.affiliate}"."deletedAt" IS NULL`)
        .returning('*')
        .execute();

      if (!result.raw[0]) {
        throw new Error('Affiliate not found or already deleted');
      }

      return result.raw[0];
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async getAll(trx: QueryRunner): Promise<AffiliateEntity[]> {
    try {
      return await trx.manager
        .createQueryBuilder(AffiliateEntity, 'affiliate')
        .where(`"${TABLE.affiliate}"."deletedAt" IS NULL`)
        .getMany();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getWithPaginationAndFilters(
    paginationDto: GenericPaginationDto,
    trx: QueryRunner,
  ): Promise<PaginationResult<AffiliateEntity[]>> {
    const { page, limit, search, filters, order } = paginationDto;

    const queryBuilder = trx.manager.createQueryBuilder(
      AffiliateEntity,
      TABLE.affiliate,
    );
    if (search) {
      queryBuilder.andWhere(
        `SIMILARITY(${TABLE.affiliate}.name, :search) > 0.3`,
        {
          search: `%${search}`,
        },
      );
    }

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        queryBuilder.andWhere(`${TABLE.affiliate}.${key} = :${key}`, {
          [key]: value,
        });
      });
    }

    queryBuilder.orderBy(`${TABLE.affiliate}.createdAt`, order || 'DESC');

    const [affiliates, total] = await queryBuilder
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();

    return {
      data: affiliates,
      page,
      limit,
      total,
      order,
    };
  }

  async findConflictingFields(
    data: Partial<AffiliateEntity>,
    trx: QueryRunner,
  ): Promise<Partial<Record<keyof AffiliateEntity, string>>> {
    const queryBuilder = trx.manager.createQueryBuilder(
      AffiliateEntity,
      TABLE.affiliate,
    );

    Object.keys(data).forEach((key, index) => {
      if (index === 0) {
        queryBuilder.where(`${TABLE.affiliate}."${key}" = :${key}`, {
          [key]: data[key],
        });
      } else {
        queryBuilder.orWhere(`${TABLE.affiliate}."${key}" = :${key}`, {
          [key]: data[key],
        });
      }
    });

    const result = await queryBuilder
      .select([
        `${TABLE.affiliate}.email`,
        `${TABLE.affiliate}.battleTag`,
        `${TABLE.affiliate}.phoneNumber`,
        `${TABLE.affiliate}.cpfCnpj`,
        `${TABLE.affiliate}.characterName`,
        `${TABLE.affiliate}.discord`,
      ])
      .getOne();

    const conflictFields: Partial<Record<keyof AffiliateEntity, string>> = {};

    if (result) {
      Object.keys(data).forEach((key) => {
        console.log(data[key], result[key]);

        if (data[key] === result[key]) {
          conflictFields[key as keyof AffiliateEntity] = result[key];
        }
      });
    }

    return conflictFields;
  }
}
