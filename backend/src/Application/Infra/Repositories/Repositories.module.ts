import { Module } from '@nestjs/common';
import { UserTypeOrmRepository } from './UserRepository/UserTypeOrm.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/Application/Entities/User.entity';
import { AffiliateEntity } from 'src/Application/Entities/Affiliate.entity';
import { AffiliateTypeOrmRepository } from './AffiliateRepository/AffiliateTypeOrm.repository';
import { ItemEntity } from 'src/Application/Entities/Item.entity';
import { ImageEntity } from 'src/Application/Entities/Image.entity';
import { ItemTypeOrmRepository } from './ItemRepository/ItemTypeOrm.repository';
import { ImageTypeormRepository } from './ImageRepository/ImageTypeOrm.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      AffiliateEntity,
      ItemEntity,
      ImageEntity,
    ]),
  ],
  providers: [
    UserTypeOrmRepository,
    AffiliateTypeOrmRepository,
    ItemTypeOrmRepository,
    ImageTypeormRepository,
  ],
  exports: [TypeOrmModule],
})
export class RepositoriesModule {}
