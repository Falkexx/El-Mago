import { SearchBuilderResult } from '#types';
import { Injectable } from '@nestjs/common';
import { TABLE } from 'src/@metadata/tables';
import { GenericPaginationDto } from 'src/utils/validators';

import { SelectQueryBuilder } from 'typeorm';

export type SearchConfig<E> = {
  searchField?: string;
  createdField?: string;
  random?: boolean;
  include?: string[]; // Lista de relacionamentos para incluir
};

@Injectable()
export class SearchBuilderService {
  constructor() {}

  async search<Entity>(
    paginationDto: GenericPaginationDto,
    entity: new () => Entity,
    tableName: string,
    queryBuilder: SelectQueryBuilder<Entity>,
    config?: SearchConfig<Entity>,
  ): Promise<SearchBuilderResult<Entity>> {
    const { page, limit, search, filters, order } = paginationDto;

    // Include relationships if config.include is defined
    if (config?.include) {
      config.include.forEach((relation) => {
        queryBuilder.leftJoinAndSelect(`${tableName}.${relation}`, relation);
      });
    }

    if (search && config?.searchField) {
      queryBuilder.andWhere(
        `SIMILARITY(${tableName}.${config.searchField}, :search) > 0.3`,
        {
          search: `%${search}%`,
        },
      );
    }

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        queryBuilder.andWhere(`${tableName}.${key} = :${key}`, {
          [key]: value,
        });
      });
    }

    if (config?.random) {
      queryBuilder.orderBy('RANDOM()');
    }

    const offset = (page - 1) * limit;

    // Select all columns of the aliased table
    const [data, total] = await queryBuilder
      .select(`${tableName}.*`)
      .from(entity, tableName)
      .take(limit)
      .skip(offset)
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);
    const remainingPages = totalPages - page;

    return {
      data,
      meta: {
        limit,
        order,
        page,
        total,
        totalPages,
        remainingPages,
      },
    };
  }
}
