import { TABLE } from 'src/@metadata/tables';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { OrderEntity } from './Order.entity';
import { RequireOnlyOne } from '#types';

type VoucherItemType = {
  item: {
    id: string;
    name: string;
  };
  voucher: {
    imagesUrl: string[];
  };
};

@Entity(TABLE.digital_shipping)
export class DigitalShippingEntity {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'timestamptz', nullable: true })
  finishedAt: Date | null; // o dia em que a a order foi concluida

  @Column({ type: 'timestamptz', nullable: true })
  deadLineForDelivery: Date | null; // o dia máximo que o afiliado pode entregar

  @Column({ type: 'timestamptz', nullable: true, default: null })
  deletedAt: Date | null;

  @Column({ type: 'jsonb' })
  voucher: VoucherItemType[];

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz' })
  updatedAt: Date;

  // relations
  @OneToOne(() => OrderEntity, (order) => order.DigitalShipping)
  @JoinColumn({ name: 'orderId' })
  Order: OrderEntity;

  @Column({ type: 'varchar', length: 40, unique: true })
  @Index()
  orderId: string;

  @Column({ type: 'varchar', length: 40 })
  affiliateId: string;
}

/**only fields can be update */
export type AffiliateAcceptOrderUpdateEntity = Partial<
  Pick<
    DigitalShippingEntity,
    | 'finishedAt'
    | 'deadLineForDelivery'
    | 'deletedAt'
    | 'affiliateId'
    | 'voucher'
    | 'updatedAt'
  >
>;

/**only unique filed */
export type AffiliateAcceptOrderUniqueRefs = RequireOnlyOne<
  Pick<DigitalShippingEntity, 'id' | 'orderId'>
>;
