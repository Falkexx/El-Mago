import { Injectable } from '@nestjs/common';
import { TABLE } from 'src/@metadata/tables';
import { GenericPaginationDto } from 'src/utils/validators';
import { SelectQueryBuilder } from 'typeorm';

export type SearchConfig = {
  searchField?: string;
  createdField?: string;
};

@Injectable()
export class SearchBuilderService {
  constructor() {}

  async search<Entity>(
    paginationDto: GenericPaginationDto,
    tableName: TABLE,
    queryBuilder: SelectQueryBuilder<Entity>,
    config?: SearchConfig,
  ) {
    const { page, limit, search, filters, order } = paginationDto;

    if (search && config.createdField) {
      queryBuilder.andWhere(
        `SIMILARITY(${tableName}."${config.searchField}", :search) > 0.3`,
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

    if (config.createdField) {
      queryBuilder.orderBy(`${tableName}."${config.createdField}"`, 'DESC');
    }

    const [data, total] = await queryBuilder
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();

    return {
      data,
      page,
      limit,
      total,
      order,
    };
  }

  generateValidFilters<Entity>(entity: Entity, filters: Record<string, any>) {}
}
