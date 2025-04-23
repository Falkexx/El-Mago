import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { WalletEntity } from './Wallet.entity';
import { TABLE } from 'src/@metadata/tables';
import { TransactionProvider, TransactionType } from 'src/@metadata';
import { RequireOnlyOne } from '#types';

@Entity({ name: TABLE.transaction })
export class TransactionEntity {
  @PrimaryColumn({ type: 'varchar', length: 40 })
  id: string;

  @Column({ type: 'numeric' })
  value: string;

  @Column({ type: 'enum', enum: TransactionType })
  type: keyof typeof TransactionType;

  @Column({ type: 'enum', enum: TransactionProvider })
  from: keyof typeof TransactionProvider;

  @Column({ type: 'enum', enum: TransactionProvider })
  to: keyof typeof TransactionProvider;

  @Column({ type: 'varchar', length: 40, nullable: true })
  orderId: string | null;

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => WalletEntity, (account) => account.Transactions)
  @JoinColumn({ name: 'accountId' })
  Wallet: WalletEntity;

  @Column({ type: 'varchar', length: 40 })
  walletId: string;
}

export type TransactionUpdateEntity = Partial<TransactionEntity>;

export type TransactionUniqueRefs = RequireOnlyOne<
  Pick<TransactionEntity, 'id'>
>;
