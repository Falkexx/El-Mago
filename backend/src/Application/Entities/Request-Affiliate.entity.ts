import { TABLE } from 'src/@metadata/tables';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  RelationId,
} from 'typeorm';
import { UserEntity } from './User.entity';
import { RequireOnlyOne } from '#types';
import { Exclude } from 'class-transformer';
import { AffiliateOnHoldStatus } from 'src/@metadata';
import { AffiliateEntity } from './Affiliate.entity';

@Entity({ name: TABLE.affiliate_queue })
export class RequestAffiliateEntity {
  @PrimaryColumn('varchar')
  id: string;

  @Column({ type: 'varchar', length: 60 })
  name: string;

  @Column({ type: 'varchar', length: 120 })
  email: string;

  @Column({ type: 'varchar', length: 50 })
  discord: string;

  @Column({ type: 'varchar', length: 50 })
  characterName: string;

  @Column({ type: 'varchar', length: 50 })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 50 })
  cpf: string;

  @Column({ type: 'varchar', length: 50 })
  country: string;

  @Column({ type: 'varchar', length: 20 })
  status: AffiliateOnHoldStatus;

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'varchar', length: 50, nullable: true, default: null })
  deletedAt: Date | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  battleTag: string;

  @Column({ type: 'varchar', array: true })
  fluentLanguages: string[];

  @OneToOne(() => AffiliateEntity, (affiliate) => affiliate)
  Affiliate: AffiliateEntity;

  @RelationId(
    (requestAffiliate: RequestAffiliateEntity) => requestAffiliate.User,
  )
  userId: string;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  @Exclude()
  User: UserEntity;
}

export class RequestAffiliateUpdateEntity {
  status: string;
  deletedAt: Date;
}

export type RequestAffiliateUnqRef = RequireOnlyOne<
  Pick<RequestAffiliateEntity, 'id' | 'userId' | 'cpf' | 'email'>
>;
