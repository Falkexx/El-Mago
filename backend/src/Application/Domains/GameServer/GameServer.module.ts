import { Module } from '@nestjs/common';
import { RepositoriesModule } from 'src/Application/Infra/Repositories/Repositories.module';
import { GamerServerController } from './GamerServer.controller';
import { GameServerService } from './GameServer.service';
import { KEY_INJECTION } from 'src/@metadata/keys';
import { GameServerTypeOrmRepository } from 'src/Application/Infra/Repositories/GameServerRepository/GameServerTypeorm.repository';

@Module({
  imports: [RepositoriesModule],
  controllers: [GamerServerController],
  providers: [
    {
      provide: KEY_INJECTION.GAME_SERVER_REPOSITORY,
      useClass: GameServerTypeOrmRepository,
    },
    GameServerService,
  ],
})
export class GameServerModule {}
