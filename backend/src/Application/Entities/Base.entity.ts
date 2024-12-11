import { Column, PrimaryColumn } from 'typeorm';

export class CustomBaseEntity {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'timestamptz', nullable: true, default: null })
  deletedAt: Date | null;

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz' })
  updatedAt: Date;
}

export type CustomBaseEntityUniqType = Pick<CustomBaseEntity, 'id'>;
