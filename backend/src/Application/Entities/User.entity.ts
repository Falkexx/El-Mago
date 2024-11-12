import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryColumn('varchar')
  id: string;

  @Column({ type: 'varchar', length: 20 })
  firstName: string;

  @Column({ type: 'varchar', length: 20 })
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

  @Column({ type: 'varchar', length: 50 })
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

  @Column({ type: 'varchar', length: 20 })
  role: 'ADMIN' | 'AFFILIATE' | 'USER'; // default: user

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz', update: true })
  updatedAt: Date;

  @Column({ type: 'boolean', default: false })
  isBanned: boolean;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;
}

export class UserUpdateEntity {
  firstName: string;
  lastName: string;
  country: string;
  password: string;
  discord: string;
  numberPhone: string;
  role: 'ADMIN' | 'AFFILIATE' | 'USER'; // default: user
  isBanned: boolean;
}

export type UserEntityUniqueRefs =
  | Pick<UserEntity, 'id'>
  | Pick<UserEntity, 'email'>
  | Pick<UserEntity, 'numberPhone'>;
