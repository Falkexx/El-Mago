import { Module } from '@nestjs/common';
import { UserService } from './User.service';
import { UserController } from './User.controller';
import { RepositoriesModule } from 'src/Application/Infra/Repositories/Repositories.module';
import { KEY_INJECTION } from 'src/@metadata/keys';
import { UserTypeOrmRepository } from 'src/Application/Infra/Repositories/UserRepository/UserTypeOrm.repository';
import { UpdateUserUseCase } from './UseCases/UpdateUser/UpdateUser.usecase';
import { CartTypeOrmRepository } from 'src/Application/Infra/Repositories/CartRepository/CartTypeOrm.repository';
import { GetCartUseCase } from './UseCases/GetCart/GetCart.usecase';
import { PutItemInCartUseCase } from './UseCases/PutItemInCart/PutItemInCart.usecase';
import { ItemTypeOrmRepository } from 'src/Application/Infra/Repositories/ItemRepository/ItemTypeOrm.repository';

@Module({
  imports: [RepositoriesModule],
  controllers: [UserController],
  providers: [
    {
      provide: KEY_INJECTION.USER_REPOSITORY_CONTRACT,
      useClass: UserTypeOrmRepository,
    },
    {
      provide: KEY_INJECTION.CART_REPOSITORY,
      useClass: CartTypeOrmRepository,
    },
    {
      provide: KEY_INJECTION.ITEM_REPOSITORY_CONTRACT,
      useClass: ItemTypeOrmRepository,
    },
    UserService,
    UpdateUserUseCase,
    GetCartUseCase,
    PutItemInCartUseCase,
  ],
  exports: [UserService],
})
export class UserModule {}
