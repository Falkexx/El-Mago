import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryColumn('varchar')
  id: string;

  @Column({ type: 'varchar', length: 20 })
  firstName: string;

  @Column({ type: 'varchar', length: 20 })
  lastName: string;

  @Column({ type: 'varchar', length: 40 })
  name: string;

  @Column({ type: 'varchar', length: 60, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 40, unique: true, nullable: true })
  cpfCnpj: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  country: string | null;

  @Column({ type: 'varchar', length: 50 })
  password: string;

  @Column({ type: 'varchar', length: 40, unique: true, nullable: true })
  discordUserName: string | null;

  @Column({ type: 'varchar', length: 40, unique: true })
  numberPhone: string;

  @Column({ type: 'int', precision: 150, nullable: true })
  age: number | null;

  @Column({ type: 'varchar', length: 20 })
  role: 'ADMIN' | 'AFFILIATE' | 'USER'; // default: user

  @Column({ type: 'timestamptz', default: new Date() })
  createdAt: Date;

  @Column({ type: 'timestamptz', default: new Date(), update: true })
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
