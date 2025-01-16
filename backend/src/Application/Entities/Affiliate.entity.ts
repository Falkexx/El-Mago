import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from './User.entity';
import { Exclude } from 'class-transformer';
import { TABLE } from 'src/@metadata/tables';
import { RequireOnlyOne } from '#types';

@Entity(TABLE.affiliate)
export class AffiliateEntity {
  @PrimaryColumn('varchar')
  id: string;

  @Column({ type: 'varchar', unique: true })
  shortId: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar', unique: true })
  battleTag: string;

  @Column({ type: 'varchar', unique: true })
  phoneNumber: string;

  @Column({ type: 'varchar', unique: true })
  cpfCnpj: string;

  @Column({ type: 'varchar', unique: true })
  characterName: string;

  @Column({ type: 'varchar', nullable: true })
  photo: string | null;

  @Column('timestamptz')
  createdAt: Date;

  @Column({ type: 'timestamptz', update: true })
  updatedAt: Date;

  @Column({ type: 'boolean' })
  isSoftDelete: boolean;

  @OneToOne(() => UserEntity, (user) => user.affiliate)
  @JoinColumn()
  @Exclude()
  user: UserEntity;
}

export class AffiliateUpdateEntity {
  name: string;
  updatedAt: Date;
  softDelete: boolean;
  numberPhone: string;
}

export type AffiliateEntityUniqueRefs = RequireOnlyOne<
  Pick<
    AffiliateEntity,
    'id' | 'email' | 'characterName' | 'shortId' | 'cpfCnpj'
  >
>;
