import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { UserEntity } from './User.entity';
import { TABLE } from 'src/@metadata/tables';
import { OrderStatus } from './order-status.entity';
import { OrderItem } from './order-item.entity';

/**
 * Preciso criar a ordem, slavar as  informações dos items  no momento da compra com
 * e criar o objsto de status da transação para slavar em uma lista
 */

export type Status = 'COMPLETED' | 'APPROVED' | 'PENDING' | 'CANCELED';

export class OrderShippingAddress {
  address: string;
  zipCode: string;
  country: string;
}

export class OrderUserInformation {
  name: string;
  lastName: string;
  email: string;
  battleTagOrBattleEmail: string;
  characterName: string;
}

@Entity({ name: TABLE.order })
export class OrderEntity {
  @PrimaryColumn('varchar')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  coupon: string | null;

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz' })
  updatedAt: Date;

  // relations
  @OneToMany(() => OrderStatus, (status) => status.order, {
    cascade: true,
    eager: true,
  })
  status: OrderStatus[];

  @Column({ type: 'varchar' })
  @Index()
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.orders, { cascade: true })
  user: UserEntity;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.Order, {
    cascade: true,
    eager: true,
  })
  OrderItems: OrderItem[];
}

export type OrderUniqueRefs = Pick<OrderEntity, 'id'>;
