import {
  GameServerEntity,
  GameServerUniqueRefs,
  GameServerUpdateEntity,
} from 'src/Application/Entities/GameServer.entity';
import { IBaseRepositoryContract } from '../IBase.repository-contract';

export type IGameServerRepositoryContract = IBaseRepositoryContract<
  GameServerEntity,
  GameServerUpdateEntity,
  GameServerUniqueRefs
>;
