import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { CartItemEntity } from './CartItem.entity';
import { UserEntity } from '../User.entity';
import { TABLE } from 'src/@metadata/tables';

@Entity({ name: TABLE.cart })
export class CartEntity {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz' })
  updatedAt: Date;

  //relations

  @OneToMany(() => CartItemEntity, (cartItem) => cartItem.cart, {
    cascade: true,
  })
  items: CartItemEntity[];

  @Column({ type: 'varchar', unique: true })
  userId: string;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}

export type CartUpdateEntity =
  | Pick<CartEntity, 'items'>
  | Pick<CartEntity, 'updatedAt'>;

export type CartUniqueRef = Pick<CartEntity, 'id'> | Pick<CartEntity, 'userId'>;
