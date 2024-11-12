import { env } from './src/utils';
import { UserEntity } from './src/Application/Entities/User.entity';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres', // ou o banco de dados que você está usando
  host: env.POSTGRES_HOST,
  port: env.POSTGRES_PORT,
  username: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DB,
  entities: [UserEntity],
  migrations: ['./src/migrations/**/*.ts'],
  synchronize: false,
  logging: true,
});
