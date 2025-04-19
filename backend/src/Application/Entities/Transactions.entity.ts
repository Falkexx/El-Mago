import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { WalletEntity } from './Wallet.entity';
import { TABLE } from 'src/@metadata/tables';
import { TransactionProvider, TransactionType } from 'src/@metadata';
import { RequireOnlyOne } from '#types';
import { OrderEntity } from './Order.entity';

@Entity({ name: TABLE.transaction })
export class TransactionEntity {
  @PrimaryColumn({ type: 'varchar', length: 40 })
  id: string;

  @Column({ type: 'numeric' })
  value: string;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column({ type: 'enum', enum: TransactionProvider })
  from: TransactionProvider;

  @Column({ type: 'enum', enum: TransactionProvider })
  to: TransactionProvider;

  @Column({ type: 'varchar', length: 40 })
  orderId: string;

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
