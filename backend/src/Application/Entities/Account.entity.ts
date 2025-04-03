import { Column, Entity, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { TransactionEntity } from './Transactions.entity';
import { TABLE } from 'src/@metadata/tables';
import { RequireOnlyOne } from '#types';
import { AffiliateEntity } from './Affiliate.entity';

@Entity({ name: TABLE.account })
export class AccountEntity {
  @PrimaryColumn({ type: 'varchar', length: 40 })
  id: string;

  @Column({ type: 'numeric' })
  balance: string;

  @OneToMany(() => TransactionEntity, (transaction) => transaction.Account)
  Transactions: TransactionEntity[];

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz', nullable: true, default: null })
  deletedAt: Date | null;

  @Column({ type: 'timestamptz' })
  updatedAt: Date;

  @OneToOne(() => AffiliateEntity, (affiliate) => affiliate.Account)
  Affiliate: AffiliateEntity;

  @Column({ type: 'varchar', length: 40 })
  affiliateId: string;
}

export type AccountUpdateEntity = Partial<Pick<AccountEntity, 'balance'>> &
  Pick<AccountEntity, 'updatedAt'>;

export type AccountUniqueRefs = RequireOnlyOne<
  Pick<AccountEntity, 'id' | 'affiliateId'>
>;
