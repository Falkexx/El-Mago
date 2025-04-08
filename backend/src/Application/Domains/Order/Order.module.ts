import { Module } from '@nestjs/common';
import { OrderService } from './Order.service';
import { OrderController } from './Order.controller';
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
import { AcceptOrderUseCase } from './UseCases/AcceptOrder/AcceptOrder.usecase';
import { AffiliateTypeOrmRepository } from 'src/Application/Infra/Repositories/AffiliateRepository/AffiliateTypeOrm.repository';
import { SendProofToOrderItemUseCase } from './UseCases/SendProofToOrderItem/SendProofToOrderItem.usecase';
import { StorageModule } from 'src/Application/Infra/Storage/Storage.module';
import { ImageTypeormRepository } from 'src/Application/Infra/Repositories/ImageRepository/ImageTypeOrm.repository';
import { GetPendingOrdersUseCase } from './UseCases/GetPendingOrders/GetPendingOrders.usecase';
import { PaymentModule } from 'src/Application/Infra/Payment/Payment.module';
import { MailModule } from 'src/Application/Infra/Mail/Mail.module';
import { OrderAffiliateController } from './OrderAffiliate/OrderAffiliate.controller';
import { GetMyCurrentOrdersAsAffiliate } from './OrderAffiliate/UseCases/GetMyCurrentOrdersAsAffiliate/GetMyCurrentOrdersAsAffiliate.usecase';
import { WalletModule } from '../Wallet/Wallet.module';
import { WalletTypeOrmRepository } from 'src/Application/Infra/Repositories/WalletRepository/WalletTypeOrm.repository';

@Module({
  imports: [
    RepositoriesModule,
    StorageModule,
    PaymentModule,
    MailModule,
    WalletModule,
  ],
  controllers: [OrderController, OrderAffiliateController],
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
      provide: KEY_INJECTION.IMAGE_REPOSITORY_CONTRACT,
      useClass: ImageTypeormRepository,
    },
    {
      provide: KEY_INJECTION.WALLET_REPOSITORY,
      useClass: WalletTypeOrmRepository,
    },
    // services
    OrderService,

    // use cases
    CreateOrderUseCase,
    PayOrderUseCase,
    GetOrderByAuthUseCase,
    GetOrderByIdUseCase,
    GetOrderAsAffiliateUseCase,
    AcceptOrderUseCase,
    SendProofToOrderItemUseCase,
    GetPendingOrdersUseCase,
    GetMyCurrentOrdersAsAffiliate,
  ],
})
export class OrderModule {}
