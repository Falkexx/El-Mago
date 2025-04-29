import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { ItemModel, ItemType } from 'src/@metadata';
import { TABLE } from 'src/@metadata/tables';
import { UserEntity } from '../User.entity';
import { Exclude } from 'class-transformer';
import { CategoryEntity } from '../Category.entity';
import { CartItemEntity } from '../Cart/CartItem.entity';
import { OrderItem } from '../order-item.entity';

@Entity(TABLE.item)
export class ItemEntity {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', enum: ItemModel })
  itemModel: keyof typeof ItemModel;

  @Column({ type: 'varchar', enum: ItemType })
  type: keyof typeof ItemType;

  @Column({ type: 'int', nullable: true })
  amount: number | null;

  @Column({ type: 'boolean' })
  isInfinite: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  price: string;

  @Column({ type: 'timestamptz', nullable: true, default: null })
  deletedAt: Date | null;

  @Column({ type: 'varchar', nullable: true })
  imageUrl: string | null;

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz', update: true })
  updatedAt: Date;

  @Column({ type: 'varchar', array: true })
  tags: string[];

  @Column({ type: 'varchar', length: 40 })
  server: string;

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

export type ItemUpdateEntity = Partial<ItemEntity>;

export type ItemUniquePrams = Pick<ItemEntity, 'id'>;
