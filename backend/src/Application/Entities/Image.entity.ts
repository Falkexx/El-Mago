import { TABLE } from 'src/@metadata/tables';
import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { ItemEntity } from './Item/Item.entity';
import { STORAGE_PROVIDER } from 'src/@metadata';
import { OrderItem } from './order-item.entity';

@Entity(TABLE.image)
export class ImageEntity {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 30 })
  mimeType: string;

  @Column({ type: 'varchar', unique: true })
  url: string;

  @Column({ type: 'varchar', length: 30 })
  bucket: string;

  @Column({ type: 'varchar' })
  storageProvider: STORAGE_PROVIDER;

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz', update: true })
  updatedAt: Date;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;
}

export class ImageUpdateEntity {
  name: string;
  mimeType: string;
  url: string;
  bucket: string;
  storageProvider: string;
  isDeleted: boolean;
}

export type ImageUniqueRef = { id: string } | { url: string };
