import { TABLE } from 'src/@metadata/tables';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { OrderEntity } from './Order.entity';
import { ItemEntity } from './Item.entity';

@Entity({ name: TABLE.order_item })
export class OrderItem {
  @PrimaryColumn('varchar')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  description?: string;

  @Column({ type: 'varchar' })
  price: string;

  @Column({ type: 'varchar' })
  currency: 'USD' | 'BRL' | 'EUR';

  @Column({ type: 'varchar' })
  itemId: string;

  @ManyToOne(() => OrderEntity, (order) => order.OrderItems)
  Order: OrderEntity;

  @ManyToOne(() => ItemEntity, (item) => item.OrderItem)
  Item: ItemEntity;
}
