import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { OrderEntity } from './Order.entity';
import { TABLE } from 'src/@metadata/tables';
import { Status } from 'aws-sdk/clients/directconnect';

@Entity({ name: TABLE.order_status })
export class OrderStatus {
  @PrimaryColumn('varchar')
  id: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  description?: string | null;
  status: Status;

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  // relations

  @ManyToOne(() => OrderEntity, (order) => order.status)
  order: OrderEntity;
}
