import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  ItemEntity,
  ItemUniquePrams,
  ItemUpdateEntity,
} from 'src/Application/Entities/Item.entity';
import { GenericPaginationDto } from 'src/utils/validators';
import { PaginationResult, SelectFieldsWithRelations } from '#types';
import { IItemRepositoryContract } from './IItem.repository-contract';
import { splitKeyAndValue } from '#utils';
import { TABLE } from 'src/@metadata/tables';
import { CategoryEntity } from 'src/Application/Entities/Category.entity';

@Injectable()
export class ItemTypeOrmRepository implements IItemRepositoryContract {
  constructor(
    @InjectRepository(ItemEntity)
    private readonly itemRepository: Repository<ItemEntity>,
  ) {}

  async create(entity: ItemEntity): Promise<ItemEntity> {
    try {
      const itemTypeOrmEntity = this.itemRepository.create(entity);
      const itemCreated = await this.itemRepository.save(itemTypeOrmEntity);
      return itemCreated;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getBy(unqRef: ItemUniquePrams): Promise<ItemEntity | null> {
    const [key, value] = splitKeyAndValue(unqRef);

    const item = await this.itemRepository.findOneBy({ [key]: value });
    return item ?? null;
  }

  async update(
    unqRef: ItemUniquePrams,
    updateEntity: ItemUpdateEntity,
  ): Promise<ItemEntity> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const itemToUpdate = await this.itemRepository.findOne({
        where: { [key]: value },
      });

      if (!itemToUpdate) {
        throw new InternalServerErrorException('Item not found');
      }

      const newItem = Object.assign(itemToUpdate, updateEntity);

      const itemUpdated = await this.itemRepository.save(newItem);

      return itemUpdated;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async delete(unqRef: ItemUniquePrams): Promise<void> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      await this.itemRepository.delete({ [key]: value });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async softDelete(unqRef: ItemUniquePrams): Promise<'success' | 'fail'> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      await this.itemRepository.softDelete({ [key]: value });
      return 'success';
    } catch {
      return 'fail';
    }
  }

  async getAll(): Promise<ItemEntity[]> {
    try {
      return this.itemRepository.find();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getWithPaginationAndFilters(
    paginationDto: GenericPaginationDto,
  ): Promise<PaginationResult<ItemEntity[]>> {
    const { page, limit, search, filters, order } = paginationDto;

    const queryBuilder = this.itemRepository.createQueryBuilder(TABLE.item);

    if (search) {
      queryBuilder.andWhere(`SIMILARITY(${TABLE.item}.name, :search) > 0.3`, {
        search: `%${search}%`,
      });
    }

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (key !== 'categories') {
          queryBuilder.andWhere(`${TABLE.item}.${key} = :${key}`, {
            [key]: value,
          });
        }
      });
    }

    if (filters) {
      try {
        const categoriesList = JSON.parse(filters.categories);

        queryBuilder.andWhere('category.id IN (:...categoryIds)', {
          categoryIds: categoriesList,
        });
      } catch {
        throw new BadRequestException(
          'error to put parameter list, see the doc',
        );
      }
    }

    queryBuilder
      .orderBy(`${TABLE.item}.createdAt`, order || 'DESC')
      .leftJoin(`${TABLE.item}.Categories`, 'category')
      .addSelect(['category.id', 'category.name']);

    try {
      const [items, total] = await queryBuilder
        .take(limit)
        .skip((page - 1) * limit)
        .getManyAndCount();

      return {
        data: items,
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

  async getOptimized<
    Fields extends keyof ItemEntity,
    Relations extends keyof ItemEntity,
  >(
    where: ItemUniquePrams,
    fields: [],
    relations?: [],
  ): Promise<SelectFieldsWithRelations<ItemEntity, Fields, Relations>[]> {
    const items = await this.itemRepository.find({
      where: { ...where },
      select: fields,
      relations: relations ?? [],
    });

    return items;
  }

  async getOneOptimized<
    Fields extends keyof ItemEntity,
    Relations extends keyof ItemEntity,
  >(
    where: ItemUniquePrams,
    fields: Fields[],
    relations?: Relations[],
  ): Promise<SelectFieldsWithRelations<ItemEntity, Fields, Relations>> {
    const items = await this.itemRepository.findOne({
      where: { ...where },
      select: fields,
      relations: relations ?? [],
    });

    return items;
  }

  async pushCategory(
    unqRef: ItemUniquePrams,
    category: CategoryEntity,
  ): Promise<ItemEntity> {
    const [key, value] = splitKeyAndValue(unqRef);

    const item = await this.itemRepository.findOne({
      where: { [key]: value },
      relations: ['Categories'],
    });

    const isCategoryAlreadyAdded = item.Categories.some(
      (_cat_) => _cat_.id === category.id,
    );

    if (!isCategoryAlreadyAdded) {
      item.Categories.push(category);

      return this.itemRepository.save(item);
    }

    return item;
  }

  async getManyByIds(ids: string[]): Promise<ItemEntity[]> {
    return this.itemRepository.find({
      where: {
        id: In(ids),
      },
    });
  }
}
