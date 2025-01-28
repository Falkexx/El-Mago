import { Module } from '@nestjs/common';
import { OrderService } from './Order.service';
import { OrderController } from './Order.controller';
import { PaypalModule } from 'src/Application/Infra/Payment/Paypal/Paypal.module';
import { CreateOrderUseCase } from './UseCases/CreateOrder/CreateOrder.usecase';
import { RepositoriesModule } from 'src/Application/Infra/Repositories/Repositories.module';
import { KEY_INJECTION } from 'src/@metadata/keys';
import { CartTypeOrmRepository } from 'src/Application/Infra/Repositories/CartRepository/CartTypeOrm.repository';
import { UserTypeOrmRepository } from 'src/Application/Infra/Repositories/UserRepository/UserTypeOrm.repository';
import { ItemTypeOrmRepository } from 'src/Application/Infra/Repositories/ItemRepository/ItemTypeOrm.repository';
import { PayOrderUseCase } from './UseCases/PayOrder/PayOrder.usecase';
import { OrderTypeOrmRepository } from 'src/Application/Infra/Repositories/OrderRepository/OrderTypeOrm.repository';
import { GetOrderByAuthUseCase } from './UseCases/GetOrdersByAuth/GetOrderByAuth.usecase';
import { GetOrderByIdUseCase } from './UseCases/GetOrderById/GetOrderById.usecase';
import { GetOrderAsAffiliateUseCase } from './UseCases/GetOrderAsAffiliate/GetOrderAsAffiliate.usecase';
import { AddAffiliateOnOrderUseCase } from './UseCases/AddAffiliateOnOrder/AddAffiliateOnOrder.usecase';
import { AffiliateTypeOrmRepository } from 'src/Application/Infra/Repositories/AffiliateRepository/AffiliateTypeOrm.repository';
import { SendProofToOrderItemUseCase } from './UseCases/SendProofToOrderItem/SendProofToOrderItem.usecase';
import { StorageModule } from 'src/Application/Infra/Storage/Storage.module';
import { ImageTypeormRepository } from 'src/Application/Infra/Repositories/ImageRepository/ImageTypeOrm.repository';

@Module({
  imports: [RepositoriesModule, PaypalModule, StorageModule],
  controllers: [OrderController],
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
    {
      provide: KEY_INJECTION.ORDER_REPOSITORY,
      useClass: OrderTypeOrmRepository,
    },
    {
      provide: KEY_INJECTION.AFFILIATE_REPOSITORY_CONTRACT,
      useClass: AffiliateTypeOrmRepository,
    },
    {
      provide: KEY_INJECTION.USER_REPOSITORY_CONTRACT,
      useClass: UserTypeOrmRepository,
    },
    {
      provide: KEY_INJECTION.IMAGE_REPOSITORY_CONTRACT,
      useClass: ImageTypeormRepository,
    },

    // services
    OrderService,

    // use cases
    CreateOrderUseCase,
    PayOrderUseCase,
    GetOrderByAuthUseCase,
    GetOrderByIdUseCase,
    GetOrderAsAffiliateUseCase,
    AddAffiliateOnOrderUseCase,
    SendProofToOrderItemUseCase,
  ],
})
export class OrderModule {}
