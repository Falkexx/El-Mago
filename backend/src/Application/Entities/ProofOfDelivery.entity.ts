import { TABLE } from 'src/@metadata/tables';
import { Column, Entity, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { AffiliateEntity } from './Affiliate.entity';
import { OrderEntity } from './Order.entity';
import { UserEntity } from './User.entity';

@Entity({ name: TABLE.proof_of_delivery })
export class ProofOfDeliveryEntity {
  @PrimaryColumn('varchar')
  id: string;

  @Column({ type: 'varchar' })
  affiliateId: string;

  @Column({ type: 'varchar' })
  clientId: string;

  @Column({ type: 'varchar' })
  imageUrl: string;

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz' })
  updateAt: Date;

  @ManyToOne(() => AffiliateEntity, (affiliate) => affiliate.ProofOfDelivery)
  Affiliate: AffiliateEntity;

  @OneToOne(() => OrderEntity, (order) => order.ProofOfDelivery)
  Order: OrderEntity;
}
