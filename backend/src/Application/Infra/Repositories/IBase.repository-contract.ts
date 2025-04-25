import { PaginationResult } from '#types';
import { GenericPaginationDto } from 'src/utils/validators';
import { QueryRunner } from 'typeorm';

export interface IBaseRepositoryContract<
  Entity,
  UpdateEntity,
  UniqueEntityRefs,
> {
  create(entity: Entity, trx: QueryRunner): Promise<Entity>;
  getBy(unqRef: UniqueEntityRefs, trx: QueryRunner): Promise<Entity | null>;
  update(
    unqRef: UniqueEntityRefs,
    updateEntity: UpdateEntity,
    trx: QueryRunner,
  ): Promise<Entity>;
  delete(unqRef: UniqueEntityRefs, trx: QueryRunner): Promise<void>;
  softDelete(unqRef: UniqueEntityRefs, trx: QueryRunner): Promise<Entity>;
  getAll(trx: QueryRunner): Promise<Entity[]>;
  getWithPaginationAndFilters(
    paginationDto: GenericPaginationDto,
    trx: QueryRunner,
  ): Promise<PaginationResult<Entity[]>>;
}
