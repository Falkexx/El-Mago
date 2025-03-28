import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ItemEntity } from '../Item.entity';
import { CartEntity } from './Cart.entity';
import { TABLE } from 'src/@metadata/tables';

@Entity({ name: TABLE.cart_item })
export class CartItemEntity {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => CartEntity, (cart) => cart.items)
  cart: CartEntity;

  @Column({ type: 'varchar' })
  itemId: string;

  @ManyToOne(() => ItemEntity, (item) => item.CartItems)
  @JoinColumn({ name: 'itemId' })
  item: ItemEntity;
}

export type UpdateCartItemEntity =
  | Pick<CartItemEntity, 'quantity'>
  | Pick<CartItemEntity, 'updatedAt'>;
