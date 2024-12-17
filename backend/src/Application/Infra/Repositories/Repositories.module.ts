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
import { CategoryTypeOrmRepository } from './Category/CategoryTypeorm.repository';
import { CategoryEntity } from 'src/Application/Entities/Category.entity';
import { CartTypeOrmRepository } from './CartRepository/CartTypeOrm.repository';
import { CartEntity } from 'src/Application/Entities/Cart/Cart.entity';
import { CartItemEntity } from 'src/Application/Entities/Cart/CartItem.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      AffiliateEntity,
      ItemEntity,
      ImageEntity,
      CategoryEntity,
      CartEntity,
      CartItemEntity,
    ]),
  ],
  providers: [
    UserTypeOrmRepository,
    AffiliateTypeOrmRepository,
    ItemTypeOrmRepository,
    ImageTypeormRepository,
    CategoryTypeOrmRepository,
    CartTypeOrmRepository,
  ],
  exports: [TypeOrmModule],
})
export class RepositoriesModule {}
