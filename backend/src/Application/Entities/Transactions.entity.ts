import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { AccountEntity } from './Account.entity';
import { TABLE } from 'src/@metadata/tables';
import { TransactionProvider, TransactionType } from 'src/@metadata';

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

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => AccountEntity, (account) => account.Transactions)
  @JoinColumn({ name: 'accountId' })
  Account: AccountEntity;

  @Column({ type: 'varchar', length: 40 })
  accountId: string;
}
