import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { ImageEntity } from './Image.entity';
import { ItemType } from 'src/@metadata';
import { TABLE } from 'src/@metadata/tables';

@Entity(TABLE.item)
export class ItemEntity {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  type: ItemType;

  @Column({ type: 'decimal', precision: 5 })
  price: number;

  @OneToOne(() => ImageEntity, (image) => image.item)
  @JoinColumn()
  image: ImageEntity;
}

export class ItemUpdateEntity {
  name: string;
  type: ItemType;
  price: number;
  image: ImageEntity;
}

export type ItemUniquePrams = Pick<ItemEntity, 'id'>;
