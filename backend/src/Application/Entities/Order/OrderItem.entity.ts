import { TABLE } from 'src/@metadata/tables';
import { Column, Entity, ManyToOne } from 'typeorm';
import { OrderEntity } from './Order.entity';
import { ItemEntity } from '../Item.entity';
import { CustomBaseEntity, CustomBaseEntityUniqType } from '../Base.entity';
import { Expose } from 'class-transformer';

@Entity(TABLE.order_item)
export class OrderItemEntity extends CustomBaseEntity {
  @Column({})
  @Expose()
  itemName: string;

  @Column({ type: 'varchar' })
  @Expose()
  productName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @Expose()
  price: number;

  @Column({ type: 'int' })
  @Expose()
  quantity: number;

  @ManyToOne(() => OrderEntity, (order) => order.items)
  @Expose()
  order: OrderEntity;

  @ManyToOne(() => ItemEntity, (item) => item.OrderItems)
  @Expose()
  item: ItemEntity;
}

export type OrderItemUniqRef = CustomBaseEntityUniqType;
