import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import {
  ImageEntity,
  ImageUniqueRef,
  ImageUpdateEntity,
} from 'src/Application/Entities/Image.entity';
import { GenericPaginationDto } from 'src/utils/validators';
import { PaginationResult } from '#types';
import { IIMageRepositoryContract } from './IImage.repository-contract';
import { splitKeyAndValue } from '#utils';
import { TABLE } from 'src/@metadata/tables';

@Injectable()
export class ImageTypeormRepository implements IIMageRepositoryContract {
  constructor() {}

  async create(entity: ImageEntity, trx: QueryRunner): Promise<ImageEntity> {
    try {
      const result = await trx.manager
        .createQueryBuilder()
        .insert()
        .into(ImageEntity)
        .values(entity)
        .returning('*')
        .execute();

      return result.raw[0];
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }
  async getBy(
    unqRef: ImageUniqueRef,
    trx: QueryRunner,
  ): Promise<ImageEntity | null> {
    try {
      const [key, value] = splitKeyAndValue(unqRef);

      const image = await trx.manager
        .createQueryBuilder(ImageEntity, 'image')
        .where(`"${TABLE.image}"."${key}" = :value`, { value })
        .getOne();

      return image ?? null;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async update(
    unqRef: ImageUniqueRef,
    updateEntity: ImageUpdateEntity,
    trx: QueryRunner,
  ): Promise<ImageEntity> {
    try {
      const [key, value] = splitKeyAndValue(unqRef);

      const result = await trx.manager
        .createQueryBuilder()
        .update(ImageEntity)
        .set(updateEntity)
        .where(`"${TABLE.image}"."${key}" = :value`, { value })
        .returning('*')
        .execute();

      if (!result.raw[0]) {
        throw new InternalServerErrorException('Image not found');
      }

      return result.raw[0];
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async delete(unqRef: ImageUniqueRef, trx: QueryRunner): Promise<void> {
    try {
      const [key, value] = splitKeyAndValue(unqRef);

      const result = await trx.manager
        .createQueryBuilder()
        .delete()
        .from(ImageEntity)
        .where(`"${TABLE.image}"."${key}" = :value`, { value })
        .execute();

      if (result.affected === 0) {
        throw new InternalServerErrorException('Image not found');
      }
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async softDelete(
    unqRef: ImageUniqueRef,
    trx: QueryRunner,
  ): Promise<ImageEntity> {
    try {
      const [key, value] = splitKeyAndValue(unqRef);

      const result = await trx.manager
        .createQueryBuilder()
        .update(ImageEntity)
        .set({ deletedAt: new Date() })
        .where(`"${TABLE.image}"."${key}" = :value`, { value })
        .andWhere(`"${TABLE.image}"."deletedAt" IS NULL`)
        .returning('*')
        .execute();

      if (!result.raw[0]) {
        throw new Error('Image not found or already deleted');
      }

      return result.raw[0];
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async getAll(trx: QueryRunner): Promise<ImageEntity[]> {
    try {
      return await trx.manager
        .createQueryBuilder(ImageEntity, 'image')
        .where(`"${TABLE.image}"."deletedAt" IS NULL`)
        .getMany();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getWithPaginationAndFilters(
    paginationDto: GenericPaginationDto,
    trx: QueryRunner,
  ): Promise<PaginationResult<ImageEntity[]>> {
    const { page, limit, search, filters, order } = paginationDto;

    const queryBuilder = trx.manager.createQueryBuilder(
      ImageEntity,
      TABLE.image,
    );

    if (search) {
      queryBuilder.andWhere(`SIMILARITY(${TABLE.image}.name, :search) > 0.3`, {
        search: `%${search}%`,
      });
    }

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        queryBuilder.andWhere(`${TABLE.image}.${key} = :${key}`, {
          [key]: value,
        });
      });
    }

    queryBuilder.orderBy(`${TABLE.image}.createdAt`, order || 'DESC');

    try {
      const [images, total] = await queryBuilder
        .take(limit)
        .skip((page - 1) * limit)
        .getManyAndCount();

      return {
        data: images,
        page,
        limit,
        total,
        order,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }
}
