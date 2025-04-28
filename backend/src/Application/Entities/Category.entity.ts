import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';
import { ItemEntity } from './Item/Item.entity';

@Entity('category')
export class CategoryEntity {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar', unique: true, length: 150 })
  name: string;

  @Column({ type: 'varchar', nullable: true, length: 150 })
  description: string | null;

  @Column({ type: 'varchar', default: false })
  isDeleted: boolean;

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz', update: true })
  updatedAt: Date;

  @ManyToMany(() => ItemEntity, (item) => item.Categories)
  Items: ItemEntity[];
}

export class CategoryUpdateEntity {
  description: Pick<CategoryEntity, 'description'>;
  isDeleted: Pick<CategoryEntity, 'isDeleted'> | boolean;
  updatedAt: Pick<CategoryEntity, 'updatedAt'>;
}

export type CategoryUniqueRefs =
  | Pick<CategoryEntity, 'id'>
  | Pick<CategoryEntity, 'name'>;
