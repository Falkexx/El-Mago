import { env } from './src/utils';
import { UserEntity } from './src/Application/Entities/User.entity';
import { DataSource } from 'typeorm';
import { AffiliateEntity } from 'src/Application/Entities/Affiliate.entity';
import { ItemEntity } from 'src/Application/Entities/Item.entity';
import { ImageEntity } from 'src/Application/Entities/Image.entity';
import { CategoryEntity } from 'src/Application/Entities/Category.entity';
import { CartEntity } from 'src/Application/Entities/Cart/Cart.entity';
import { CartItemEntity } from 'src/Application/Entities/Cart/CartItem.entity';
import { OrderEntity } from 'src/Application/Entities/Order.entity';
import { OrderStatus } from 'src/Application/Entities/order-status.entity';
import { OrderItem } from 'src/Application/Entities/order-item.entity';
import { RequestAffiliateEntity } from 'src/Application/Entities/Request-Affiliate.entity';

export const AppDataSource = new DataSource({
  type: 'postgres', // ou o banco de dados que você está usando
  host: env.POSTGRES_HOST,
  port: env.POSTGRES_PORT,
  username: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DB,
  entities: [
    UserEntity,
    AffiliateEntity,
    ItemEntity,
    ImageEntity,
    CategoryEntity,
    CartEntity,
    CartItemEntity,
    OrderEntity,
    OrderStatus,
    OrderItem,
    RequestAffiliateEntity,
  ],
  migrations: ['./src/migrations/**/*.ts'],
  synchronize: false,
  logging: true,
});
