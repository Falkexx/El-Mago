import { TABLE } from 'src/@metadata/tables';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { OrderEntity } from './Order.entity';
import { ItemEntity } from './Item.entity';
import { RequireOnlyOne } from '#types';

@Entity({ name: TABLE.order_item })
export class OrderItem {
  @PrimaryColumn('varchar')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'varchar' })
  description?: string;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  price: string;

  @Column({ type: 'varchar' })
  currency: 'USD';

  @Column({ type: 'varchar' })
  imageUrl: string;

  @ManyToOne(() => OrderEntity, (order) => order.OrderItems)
  @JoinColumn({ name: 'orderId' })
  Order: OrderEntity;

  @Column({ type: 'varchar' })
  orderId: string;

  @ManyToOne(() => ItemEntity, (item) => item.OrderItem)
  @JoinColumn({ name: 'itemId' })
  Item: ItemEntity;

  @Column({ type: 'varchar' })
  itemId: string;

  @Column({ type: 'jsonb', nullable: true, default: null })
  proofOfDelivery: any;
}

export type OrderItemUniqueRefs = RequireOnlyOne<Pick<OrderItem, 'id'>>;
