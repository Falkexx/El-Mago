import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CategoryEntity,
  CategoryUniqueRefs,
  CategoryUpdateEntity,
} from 'src/Application/Entities/Category.entity';
import { Repository } from 'typeorm';
import { ICategoryRepositoryContract } from './ICategory.repository-contract';
import { splitKeyAndValue } from '#utils';
import { PaginationResult } from '#types';
import { GenericPaginationDto } from 'src/utils/validators';
import { TABLE } from 'src/@metadata/tables';

@Injectable()
export class CategoryTypeOrmRepository implements ICategoryRepositoryContract {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(entity: CategoryEntity): Promise<CategoryEntity> {
    try {
      const categoryTypeOrmEntity = this.categoryRepository.create(entity);
      const categoryCreated = await this.categoryRepository.save(
        categoryTypeOrmEntity,
      );

      return categoryCreated;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getBy(unqRef: CategoryUniqueRefs): Promise<CategoryEntity | null> {
    const [key, value] = splitKeyAndValue(unqRef);

    const category = await this.categoryRepository.findOneBy({ [key]: value });

    return category ?? null;
  }

  async update(
    unqRef: CategoryUniqueRefs,
    updateEntity: CategoryUpdateEntity,
  ): Promise<CategoryEntity> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const categoryToUpdate = await this.categoryRepository.findOne({
        where: { [key]: value },
      });

      const newCategory = Object.assign(categoryToUpdate, {
        ...updateEntity,
      } as CategoryUpdateEntity);

      const categoryUpdated = await this.categoryRepository.save(newCategory);

      return categoryUpdated;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async delete(unqRef: CategoryUniqueRefs): Promise<void> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      await this.categoryRepository.delete({ [key]: value });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async softDelete(unqRef: CategoryUniqueRefs): Promise<'success' | 'fail'> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const category = await this.categoryRepository.findOne({ [key]: value });

      const newCategory = Object.assign(category, {
        isDeleted: true,
      } as Partial<CategoryUpdateEntity>);

      await this.categoryRepository.save(newCategory);
      return 'success';
    } catch {
      return 'fail';
    }
  }

  async getAll(): Promise<CategoryEntity[]> {
    return this.categoryRepository.find();
  }

  async getWithPaginationAndFilters(
    paginationDto: GenericPaginationDto,
  ): Promise<PaginationResult<CategoryEntity[]>> {
    const { page, limit, search, filters, order } = paginationDto;

    const queryBuilder = this.categoryRepository.createQueryBuilder(
      TABLE.category,
    );

    if (search) {
      queryBuilder.andWhere(
        `SIMILARITY(${TABLE.category}.name, :search) > 0.3`,
        {
          search: `%${search}`,
        },
      );
    }

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        queryBuilder.andWhere(`${TABLE.category}.${key} = :${key}`, {
          [key]: value,
        });
      });
    }

    queryBuilder.orderBy(`${TABLE.category}.createdAt`, order || 'DESC');

    const [categories, total] = await queryBuilder
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();

    return {
      data: categories,
      page,
      limit,
      total,
      order,
    };
  }
}
