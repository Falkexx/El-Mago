export interface IBaseRepositoryContract<
  Entity,
  UpdateEntity,
  UniqueEntityRefs,
> {
  create(entity: Entity): Promise<Entity>;
  getBy(unqRef: UniqueEntityRefs): Promise<Entity | null>;
  update(updateEntity: UpdateEntity): Promise<Entity>;
  delete(unqRef: UniqueEntityRefs): Promise<void>;
}
