import {
  Column,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { TransactionEntity } from './Transactions.entity';
import { TABLE } from 'src/@metadata/tables';
import { RequireOnlyOne } from '#types';
import { AffiliateEntity } from './Affiliate.entity';

@Entity({ name: TABLE.wallet })
export class WalletEntity {
  @PrimaryColumn({ type: 'varchar', length: 40 })
  id: string;

  @Column({ type: 'numeric' })
  balance: string;

  @OneToMany(() => TransactionEntity, (transaction) => transaction.Wallet)
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
  @Index({ unique: true })
  affiliateId: string;
}

export type WalletUpdateEntity = Partial<Pick<WalletEntity, 'balance'>> &
  Pick<WalletEntity, 'updatedAt'>;

export type WalletUniqueRefs = RequireOnlyOne<
  Pick<WalletEntity, 'id' | 'affiliateId'>
>;
