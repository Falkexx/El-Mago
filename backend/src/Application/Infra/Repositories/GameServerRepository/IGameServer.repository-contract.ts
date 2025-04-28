import {
  GameServerEntity,
  GameServerUniqueRefs,
  GameServerUpdateEntity,
} from 'src/Application/Entities/GameServer.entity';
import { IBaseRepositoryContract } from '../IBase.repository-contract';

export interface IGameServerRepositoryContract
  extends IBaseRepositoryContract<
    GameServerEntity,
    GameServerUpdateEntity,
    GameServerUniqueRefs
  > {}
