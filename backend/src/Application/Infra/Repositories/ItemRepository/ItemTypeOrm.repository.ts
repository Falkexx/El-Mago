import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import {
  ItemEntity,
  ItemUniquePrams,
  ItemUpdateEntity,
} from 'src/Application/Entities/Item/Item.entity';
import { GenericPaginationDto } from 'src/utils/validators';
import { SearchBuilderResult, SelectFieldsWithRelations } from '#types';
import { IItemRepositoryContract } from './IItem.repository-contract';
import { splitKeyAndValue } from '#utils';
import { TABLE } from 'src/@metadata/tables';
import { CategoryEntity } from 'src/Application/Entities/Category.entity';
import { SearchBuilderService } from '../SearchBuilder.service';

@Injectable()
export class ItemTypeOrmRepository implements IItemRepositoryContract {
  constructor(private readonly searchBuilderService: SearchBuilderService) {}

  async create(entity: ItemEntity, trx: QueryRunner): Promise<ItemEntity> {
    try {
      const result = await trx.manager
        .createQueryBuilder()
        .insert()
        .into(ItemEntity)
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
    unqRef: ItemUniquePrams,
    trx: QueryRunner,
  ): Promise<ItemEntity | null> {
    try {
      const [key, value] = splitKeyAndValue(unqRef);

      const item = await trx.manager
        .createQueryBuilder()
        .select(TABLE.item)
        .from(ItemEntity, TABLE.item)
        .where(`"${TABLE.item}"."${key}" = :value`, { value })
        .getOne();

      return item ?? null;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async update(
    unqRef: ItemUniquePrams,
    updateEntity: ItemUpdateEntity,
    trx: QueryRunner,
  ): Promise<ItemEntity> {
    try {
      const [key, value] = splitKeyAndValue(unqRef);

      const result = await trx.manager
        .createQueryBuilder()
        .update(ItemEntity)
        .set(updateEntity)
        .where(`"${TABLE.item}"."${key}" = :value`, { value })
        .returning('*')
        .execute();

      if (!result.raw[0]) {
        throw new InternalServerErrorException('Item not found');
      }

      return result.raw[0];
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async delete(unqRef: ItemUniquePrams, trx: QueryRunner): Promise<void> {
    try {
      const [key, value] = splitKeyAndValue(unqRef);

      const result = await trx.manager
        .createQueryBuilder()
        .update(ItemEntity)
        .set({ deletedAt: new Date() })
        .where(`"${TABLE.item}"."${key}" = :value`, { value })
        .execute();

      if (result.affected === 0) {
        throw new InternalServerErrorException(
          'Item not found or already deleted',
        );
      }
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async softDelete(
    unqRef: ItemUniquePrams,
    trx: QueryRunner,
  ): Promise<ItemEntity> {
    try {
      const [key, value] = splitKeyAndValue(unqRef);

      const result = await trx.manager
        .createQueryBuilder()
        .update(ItemEntity)
        .set({ deletedAt: new Date() })
        .where(`"${TABLE.item}"."${key}" = :value`, { value })
        .andWhere(`"${TABLE.item}"."deletedAt" IS NULL`)
        .returning('*')
        .execute();

      if (!result.raw[0]) {
        throw new Error('Item not found or already deleted');
      }

      return result.raw[0];
    } catch {
      throw new InternalServerErrorException();
    }
  }
  async getAll(trx: QueryRunner): Promise<ItemEntity[]> {
    try {
      return await trx.manager
        .createQueryBuilder(ItemEntity, 'item')
        .where(`"${TABLE.item}"."deletedAt" IS NULL`)
        .getMany();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getWithPaginationAndFilters(
    paginationDto: GenericPaginationDto,
    trx: QueryRunner,
  ): Promise<SearchBuilderResult<ItemEntity>> {
    try {
      // Initialize queryBuilder with entity and alias
      const queryBuilder = trx.manager.createQueryBuilder();

      const result = await this.searchBuilderService.search(
        paginationDto,
        ItemEntity,
        TABLE.item,
        queryBuilder,
      );

      return result;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getOptimized<
    Fields extends keyof ItemEntity,
    Relations extends keyof ItemEntity,
  >(
    where: ItemUniquePrams,
    fields: Fields[],
    trx: QueryRunner,
    relations?: Relations[],
  ): Promise<SelectFieldsWithRelations<ItemEntity, Fields, Relations>[]> {
    try {
      const [key, value] = splitKeyAndValue(where);

      const query = trx.manager
        .createQueryBuilder(ItemEntity, 'item')
        .select(fields.map((field) => `"item"."${field}"`))
        .where(`"${TABLE.item}"."${key}" = :value`, { value })
        .andWhere(`"${TABLE.item}"."deletedAt" IS NULL`);

      if (relations && relations.length > 0) {
        relations.forEach((relation) =>
          query.leftJoinAndSelect(`item.${relation}`, relation),
        );
      }

      return await query.getMany();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getOneOptimized<
    Fields extends keyof ItemEntity,
    Relations extends keyof ItemEntity,
  >(
    where: ItemUniquePrams,
    fields: Fields[],
    trx: QueryRunner,
    relations?: Relations[],
  ): Promise<SelectFieldsWithRelations<ItemEntity, Fields, Relations>> {
    try {
      const [key, value] = splitKeyAndValue(where);

      const query = trx.manager
        .createQueryBuilder(ItemEntity, 'item')
        .select(fields.map((field) => `"item"."${field}"`))
        .where(`"${TABLE.item}"."${key}" = :value`, { value })
        .andWhere(`"${TABLE.item}"."deletedAt" IS NULL`);

      if (relations && relations.length > 0) {
        relations.forEach((relation) =>
          query.leftJoinAndSelect(`item.${relation}`, relation),
        );
      }

      const item = await query.getOne();

      return item ?? null;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async pushCategory(
    unqRef: ItemUniquePrams,
    category: CategoryEntity,
    trx: QueryRunner,
  ): Promise<ItemEntity> {
    try {
      const [key, value] = splitKeyAndValue(unqRef);

      const item = await trx.manager
        .createQueryBuilder(ItemEntity, 'item')
        .leftJoinAndSelect('item.Categories', 'categories')
        .where(`"${TABLE.item}"."${key}" = :value`, { value })
        .andWhere(`"${TABLE.item}"."deletedAt" IS NULL`)
        .getOne();

      if (!item) {
        throw new InternalServerErrorException('Item not found');
      }

      const isCategoryAlreadyAdded = item.Categories.some(
        (_cat_) => _cat_.id === category.id,
      );

      if (!isCategoryAlreadyAdded) {
        item.Categories.push(category);

        const result = await trx.manager
          .createQueryBuilder()
          .update(ItemEntity)
          .set({ Categories: item.Categories })
          .where(`"${TABLE.item}"."${key}" = :value`, { value })
          .andWhere(`"${TABLE.item}"."deletedAt" IS NULL`)
          .returning('*')
          .execute();

        return result.raw[0];
      }

      return item;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getManyByIds(ids: string[], trx: QueryRunner): Promise<ItemEntity[]> {
    try {
      return await trx.manager
        .createQueryBuilder(ItemEntity, 'item')
        .where(`"${TABLE.item}"."id" IN (:...ids)`, { ids })

        .getMany();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }
}
