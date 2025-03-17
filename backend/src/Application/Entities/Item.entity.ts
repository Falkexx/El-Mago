import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { ImageEntity } from './Image.entity';
import { ItemType } from 'src/@metadata';
import { TABLE } from 'src/@metadata/tables';
import { UserEntity } from './User.entity';
import { Exclude } from 'class-transformer';
import { CategoryEntity } from './Category.entity';
import { CartItemEntity } from './Cart/CartItem.entity';
import { OrderItem } from './order-item.entity';

@Entity(TABLE.item)
export class ItemEntity {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description: string | null;

  @Column({ type: 'varchar' })
  type: ItemType;

  @Column({ type: 'int', nullable: true })
  amount: number | null;

  @Column({ type: 'boolean' })
  isInfinite: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  price: number;

  @Column({ type: 'boolean', default: false })
  softDeleted: boolean;

  @Column({ type: 'varchar' })
  imageUrl: string;

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz', update: true })
  updatedAt: Date;

  @Column({ type: 'varchar', array: true })
  tags: string[];

  @ManyToOne(() => UserEntity, (user) => user.items)
  @Exclude()
  user: UserEntity;

  @ManyToMany(() => CategoryEntity, (category) => category.Items)
  @JoinTable()
  Categories: CategoryEntity[];

  @OneToMany(() => CartItemEntity, (cartItem) => cartItem.item)
  CartItems: CartItemEntity[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.Item)
  OrderItem: OrderItem;
}

export class ItemUpdateEntity {
  name: string;
  type: ItemType;
  price: number;
  image: ImageEntity;
}

export type ItemUniquePrams = Pick<ItemEntity, 'id'>;
