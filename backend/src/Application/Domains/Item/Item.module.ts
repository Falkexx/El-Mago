import { Module } from '@nestjs/common';
import { ItemController } from './Item.controller';
import { CreateItemService } from '../Item/UseCases/CreateItem/CreateItem.service';
import { KEY_INJECTION } from 'src/@metadata/keys';
import { UserTypeOrmRepository } from 'src/Application/Infra/Repositories/UserRepository/UserTypeOrm.repository';
import { RepositoriesModule } from 'src/Application/Infra/Repositories/Repositories.module';
import { ImageTypeormRepository } from 'src/Application/Infra/Repositories/ImageRepository/ImageTypeOrm.repository';
import { ItemTypeOrmRepository } from 'src/Application/Infra/Repositories/ItemRepository/ItemTypeOrm.repository';
import { CategoryTypeOrmRepository } from 'src/Application/Infra/Repositories/Category/CategoryTypeorm.repository';
import { StorageModule } from 'src/Application/Infra/Storage/Storage.module';
import { AssignCategoryUseCase } from './UseCases/AssinCategory/AsssignCategory.usecase';
import { GetManyItemsUseCase } from './UseCases/GetMany/GetManyItems.usecase';
import { GameServerTypeOrmRepository } from 'src/Application/Infra/Repositories/GameServerRepository/GameServerTypeorm.repository';

@Module({
  imports: [RepositoriesModule, StorageModule],
  controllers: [ItemController],
  providers: [
    {
      provide: KEY_INJECTION.USER_REPOSITORY_CONTRACT,
      useClass: UserTypeOrmRepository,
    },
    {
      provide: KEY_INJECTION.IMAGE_REPOSITORY_CONTRACT,
      useClass: ImageTypeormRepository,
    },
    {
      provide: KEY_INJECTION.ITEM_REPOSITORY_CONTRACT,
      useClass: ItemTypeOrmRepository,
    },
    {
      provide: KEY_INJECTION.CATEGORY_REPOSITORY,
      useClass: CategoryTypeOrmRepository,
    },
    {
      provide: KEY_INJECTION.GAME_SERVER_REPOSITORY,
      useClass: GameServerTypeOrmRepository,
    },
    CreateItemService,

    AssignCategoryUseCase,
    GetManyItemsUseCase,
  ],
})
export class ItemModule {}
