import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from './User.entity';

@Entity('affiliate')
export class AffiliateEntity {
  @PrimaryColumn('varchar')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar', unique: true })
  username: string;

  @Column('timestamptz')
  createdAt: Date;

  @Column({ type: 'timestamptz', update: true })
  updatedAt: Date;

  @Column({ type: 'boolean' })
  idSoftDelete: boolean;

  @OneToOne(() => UserEntity, (user) => user.affiliate)
  user: UserEntity;
}

export class AffiliateUpdateEntity {
  name: string;
  updatedAt: Date;
  softDelete: boolean;
}

export type AffiliateEntityUniqueRefs =
  | Pick<AffiliateEntity, 'id'>
  | Pick<AffiliateEntity, 'email'>
  | Pick<AffiliateEntity, 'username'>;
