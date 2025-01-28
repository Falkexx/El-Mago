import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { AffiliateEntity } from './Affiliate.entity';
import { ItemEntity } from './Item.entity';
import { CartEntity } from './Cart/Cart.entity';
import { OrderEntity } from './Order.entity';
import { RequestAffiliateEntity } from './Request-Affiliate.entity';
import { ROLE } from 'src/@metadata/roles';
import { Languages } from 'src/@metadata';

@Entity('user')
export class UserEntity {
  @PrimaryColumn('varchar')
  id: string;

  @Column({ type: 'varchar', length: 20, nullable: true, default: null })
  firstName: string;

  @Column({ type: 'varchar', length: 20, nullable: true, default: null })
  lastName: string;

  @Column({ type: 'varchar', length: 60, unique: true })
  email: string;

  @Column({
    type: 'varchar',
    length: 40,
    unique: true,
    nullable: true,
    default: null,
  })
  cpfCnpj: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true, default: null })
  country: string | null;

  @Column({ type: 'varchar', length: 250 })
  @Exclude()
  password: string;

  @Column({
    type: 'varchar',
    length: 40,
    unique: true,
    nullable: true,
    default: null,
  })
  discordUserName: string | null;

  @Column({
    type: 'varchar',
    length: 40,
    unique: true,
    nullable: true,
    default: null,
  })
  numberPhone: string | null;

  @Column({ type: 'numeric', precision: 150, nullable: true, default: null })
  age: number | null;

  @Column({ type: 'varchar', length: 20, array: true })
  roles: ROLE[]; // default: user

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz', update: true })
  updatedAt: Date;

  @Column({ type: 'boolean', default: false })
  isBanned: boolean;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @OneToOne(() => AffiliateEntity, (affiliate) => affiliate.user)
  affiliate: AffiliateEntity | null;

  @OneToMany(() => ItemEntity, (items) => items.user)
  items: ItemEntity[];

  @OneToOne(() => CartEntity)
  cart: CartEntity;

  @OneToMany(() => OrderEntity, (order) => order.user)
  orders: OrderEntity[];

  @Column({ type: 'varchar', array: true, enum: Languages, default: [] })
  fluentLanguages: Languages[];

  @OneToOne(() => RequestAffiliateEntity)
  RequestAffiliate: RequestAffiliateEntity;
}

export class UserUpdateEntity {
  firstName: string;
  lastName: string;
  country: string;
  password: string;
  discord: string;
  numberPhone: string;
  roles: ROLE[]; // default: user
  isBanned: boolean;
  isDeleted: boolean;
  fluentLanguages: Languages[];
}

export type UserEntityUniqueRefs =
  | Pick<UserEntity, 'id'>
  | Pick<UserEntity, 'email'>
  | Pick<UserEntity, 'numberPhone'>;
