import { Column, Entity, PrimaryColumn, ManyToMany } from 'typeorm';
import { ItemEntity } from './Item.entity';
import { TABLE } from 'src/@metadata/tables';

@Entity(TABLE.game_server)
export class GameServerEntity {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar', unique: true, length: 150 })
  name: string;

  @Column({ type: 'varchar', nullable: true, length: 150 })
  description: string | null;

  @Column({ type: 'varchar', default: false })
  isDeleted: boolean;

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz', update: true })
  updatedAt: Date;

  @ManyToMany(() => ItemEntity, (item) => item.GameServers)
  Items: ItemEntity[];
}

export class GameServerUpdateEntity {
  description: Pick<GameServerEntity, 'description'>;
  isDeleted: Pick<GameServerEntity, 'isDeleted'> | boolean;
  updatedAt: Pick<GameServerEntity, 'updatedAt'>;
}

export type GameServerUniqueRefs =
  | Pick<GameServerEntity, 'id'>
  | Pick<GameServerEntity, 'name'>;
