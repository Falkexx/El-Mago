import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { UserEntity } from './User.entity';
import { Exclude } from 'class-transformer';
import { TABLE } from 'src/@metadata/tables';
import { RequireOnlyOne } from '#types';
import { Languages } from 'src/@metadata';
import { OrderEntity } from './Order.entity';
import { ProofOfDeliveryEntity } from './ProofOfDelivery.entity';

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

  @Column({ type: 'varchar', length: 50 })
  discord: string;

  @Column({ type: 'enum', array: true, enum: Languages })
  fluentLanguages: string[];

  @OneToMany(() => OrderEntity, (order) => order.Affiliate)
  Orders: OrderEntity[];

  @OneToOne(() => UserEntity, (user) => user.affiliate)
  @JoinColumn()
  @Exclude()
  user: UserEntity;

  @OneToMany(
    () => ProofOfDeliveryEntity,
    (proofOfDelivery) => proofOfDelivery.Affiliate,
  )
  ProofOfDelivery: ProofOfDeliveryEntity[];
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
