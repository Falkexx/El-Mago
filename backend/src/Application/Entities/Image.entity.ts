import { TABLE } from 'src/@metadata/tables';
import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { ItemEntity } from './Item.entity';

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
  bucket: 'S3';

  @Column({ type: 'varchar' })
  storageProvider: string;

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz', update: true })
  updatedAt: Date;

  @OneToOne(() => ItemEntity, (item) => item.image)
  item: ItemEntity;
}

export class ImageUpdateEntity {
  name: string;
  mimeType: string;
  url: string;
  bucket: string;
  storageProvider: string;
}

export type ImageUniqueRef = { id: string } | { url: string };
