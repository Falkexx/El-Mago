import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { ItemEntity } from '../Item.entity';
import { CartEntity } from './Cart.entity';
import { TABLE } from 'src/@metadata/tables';

@Entity({ name: TABLE.cart_item })
export class CartItemEntity {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'int' })
  amount: number;

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => CartEntity, (cart) => cart.items)
  cart: CartEntity;

  @ManyToOne(() => ItemEntity, (item) => item.CartItems)
  item: ItemEntity;
}
