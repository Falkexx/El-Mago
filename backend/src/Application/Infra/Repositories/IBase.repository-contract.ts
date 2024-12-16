import { PaginationResult } from '#types';
import { GenericPaginationDto } from 'src/utils/validators';

export interface IBaseRepositoryContract<
  Entity,
  UpdateEntity,
  UniqueEntityRefs,
> {
  create(entity: Entity): Promise<Entity>;
  getBy(unqRef: UniqueEntityRefs): Promise<Entity | null>;
  update(unqRef: UniqueEntityRefs, updateEntity: UpdateEntity): Promise<Entity>;
  delete(unqRef: UniqueEntityRefs): Promise<void>;
  softDelete(unqRef: UniqueEntityRefs): Promise<'success' | 'fail'>;
  getAll(): Promise<Entity[]>;
  getWithPaginationAndFilters<R extends keyof Entity>(
    paginationDto: GenericPaginationDto,
  ): Promise<PaginationResult<Entity[]>>;
}
