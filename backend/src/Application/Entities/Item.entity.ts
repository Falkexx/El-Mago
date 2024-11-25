import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { ImageEntity } from './Image.entity';
import { ItemType } from 'src/@metadata';
import { TABLE } from 'src/@metadata/tables';
import { UserEntity } from './User.entity';
import { Exclude } from 'class-transformer';

@Entity(TABLE.item)
export class ItemEntity {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description: string | null;

  @Column({ type: 'varchar' })
  type: ItemType;

  @Column({ type: 'int', nullable: true })
  amount: number | null;

  @Column({ type: 'boolean' })
  isInfinite: boolean;

  @Column({ type: 'decimal', precision: 5 })
  price: number;

  @Column({ type: 'boolean', default: false })
  softDeleted: boolean;

  @OneToOne(() => ImageEntity, (image) => image.item)
  @JoinColumn()
  image: ImageEntity;

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz', update: true })
  updatedAt: Date;

  @Column({ type: 'varchar', array: true })
  tags: string[];

  @ManyToOne(() => UserEntity, (user) => user.items)
  @Exclude()
  user: UserEntity;
}

export class ItemUpdateEntity {
  name: string;
  type: ItemType;
  price: number;
  image: ImageEntity;
}

export type ItemUniquePrams = Pick<ItemEntity, 'id'>;
