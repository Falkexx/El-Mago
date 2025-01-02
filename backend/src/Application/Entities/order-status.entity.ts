import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { OrderEntity } from './Order.entity';
import { TABLE } from 'src/@metadata/tables';
import { OrderStatusType } from '#types';

@Entity({ name: TABLE.order_status })
export class OrderStatus {
  @PrimaryColumn('varchar')
  id: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  description?: string | null;

  @Column({ type: 'varchar', length: 50 })
  status: OrderStatusType;

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  // relations

  @ManyToOne(() => OrderEntity, (order) => order.status)
  order: OrderEntity;
}
