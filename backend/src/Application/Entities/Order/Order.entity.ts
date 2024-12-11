import { TABLE } from 'src/@metadata/tables';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { UserEntity } from '../User.entity';
import { OrderItemEntity } from './OrderItem.entity';
import { CustomBaseEntity, CustomBaseEntityUniqType } from '../Base.entity';
import { Exclude, Expose } from 'class-transformer';

@Entity(TABLE.order)
export class OrderEntity extends CustomBaseEntity {
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @Expose()
  totalAmount: number;

  @Column({ type: 'varchar', length: 20 })
  @Expose()
  orderStatus: 'pending' | 'completed' | 'cancelled' | 'shipped';

  @Column({ type: 'varchar', length: 20 })
  @Expose()
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';

  @ManyToOne(() => UserEntity, (user) => user.orders)
  @Exclude()
  user: UserEntity;

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order)
  @Expose()
  items: OrderItemEntity[];
}

export type OrderUniqRef = CustomBaseEntityUniqType;
