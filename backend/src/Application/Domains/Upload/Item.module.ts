import { Module } from '@nestjs/common';
import { ItemController } from './Item.controller';
import { CreateItemService } from './UseCases/CreateItem/CreateItem.service';
import { KEY_INJECTION } from 'src/@metadata/keys';
import { UserTypeOrmRepository } from 'src/Application/Infra/Repositories/UserRepository/UserTypeOrm.repository';
import { RepositoriesModule } from 'src/Application/Infra/Repositories/Repositories.module';
import { ImageTypeormRepository } from 'src/Application/Infra/Repositories/ImageRepository/ImageTypeOrm.repository';
import { ItemTypeOrmRepository } from 'src/Application/Infra/Repositories/ItemRepository/ItemTypeOrm.repository';

@Module({
  imports: [RepositoriesModule],
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
    CreateItemService,
  ],
})
export class ItemModule {}
