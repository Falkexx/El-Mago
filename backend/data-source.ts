import { env } from './src/utils';
import { UserEntity } from './src/Application/Entities/User.entity';
import { DataSource } from 'typeorm';
import { AffiliateEntity } from 'src/Application/Entities/Affiliate.entity';
import { ItemEntity } from 'src/Application/Entities/Item.entity';
import { ImageEntity } from 'src/Application/Entities/Image.entity';
import { CategoryEntity } from 'src/Application/Entities/Category.entity';
import { OrderEntity } from 'src/Application/Entities/Order/Order.entity';
import { OrderItemEntity } from 'src/Application/Entities/Order/OrderItem.entity';

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
    OrderEntity,
    OrderItemEntity,
  ],
  migrations: ['./src/migrations/**/*.ts'],
  synchronize: false,
  logging: true,
});
