import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { UserEntity } from './User.entity';
import { TABLE } from 'src/@metadata/tables';
import { OrderStatus } from './order-status.entity';
import { OrderItem } from './order-item.entity';
import { AffiliateEntity } from './Affiliate.entity';
import { RequireOnlyOne } from '#types';

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

  @Column({ type: 'varchar', nullable: true, default: null })
  coupon: string | null;

  @Column({ type: 'numeric' })
  totalPrice: string;

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

  @Column({ type: 'varchar', nullable: true, default: null })
  paymentUrl: string | null;

  @Column({ type: 'varchar', nullable: true, default: null })
  paymentId: string | null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  platform: 'PC' | 'XBOX' | null;

  @Column({ type: 'varchar', length: 120 })
  nickName: string;

  @Column({ type: 'varchar', length: 120 })
  battleTag: string;

  @Column({ type: 'timestamptz', nullable: true })
  expiresAt: Date | null;

  @Column({ type: 'boolean', nullable: true, default: null })
  completedAt: Date | null;

  @ManyToOne(() => UserEntity, (user) => user.orders, { cascade: true })
  user: UserEntity;

  @ManyToOne(() => AffiliateEntity, (affiliate) => affiliate.orders)
  @JoinColumn({ name: 'affiliateId' })
  Affiliate: AffiliateEntity;

  @Column({ type: 'varchar', length: 40, nullable: true, default: null })
  affiliateId: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.Order, {
    cascade: true,
    eager: true,
  })
  OrderItems: OrderItem[];

  @Column({ type: 'jsonb', nullable: true, default: null })
  proofOfDelivery:
    | { itemId: string; imageUrl: string; createdAt: Date }[]
    | null;
}

export type OrderUniqueRefs = RequireOnlyOne<Pick<OrderEntity, 'id'>>;
