import { TABLE } from 'src/@metadata/tables';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { OrderEntity } from './Order.entity';
import { ItemEntity } from './Item.entity';
import { ImageEntity } from './Image.entity';
import { nullable } from 'zod';
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
  currency: 'USD' | 'BRL' | 'EUR';

  @Column({ type: 'varchar' })
  itemId: string;

  @OneToOne(() => ImageEntity, (image) => image.ProofImage, {
    nullable: true,
  })
  @JoinColumn({ name: 'proofImageId' })
  ProofImage: ImageEntity | null;

  @Column({
    type: 'varchar',
    name: 'proofImageId',
    nullable: true,
    unique: true,
  })
  proofImageId: string | null;

  // @Column({ type: 'varchar', length: 120 })
  // server: string;

  @ManyToOne(() => OrderEntity, (order) => order.OrderItems)
  Order: OrderEntity;

  @ManyToOne(() => ItemEntity, (item) => item.OrderItem)
  Item: ItemEntity;
}

export type OrderItemUniqueRefs = RequireOnlyOne<
  Pick<OrderItem, 'id' | 'proofImageId'>
>;
