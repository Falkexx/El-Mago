import { RequireOnlyOne } from '#types';
import { TABLE } from 'src/@metadata/tables';
import { Column, Entity } from 'typeorm';
import { CustomBaseEntity } from './Base.entity';

@Entity({ name: TABLE.game_server })
export class GameServerEntity extends CustomBaseEntity {
  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 120, nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image: string | null;
}

export type GameServerUpdateEntity = Partial<GameServerEntity>;

export type GameServerUniqueRefs = RequireOnlyOne<
  Pick<GameServerEntity, 'id' | 'name'>
>;
