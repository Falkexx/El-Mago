import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from './utils';
import { UserModule } from './Application/Domains/User/User.module';
import { AuthModule } from './Application/Domains/Auth/Auth.module';
import { AdminModule } from './Application/Domains/Admin/Admin.module';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ItemModule } from './Application/Domains/Item/Item.module';
import { CategoryModule } from './Application/Domains/Category/Category.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { Redis } from 'ioredis';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 3000,
          limit: 10,
        },
      ],
      storage: new ThrottlerStorageRedisService(
        new Redis({
          host: env.REDIS_HOST,
          port: env.REDIS_PORT,
          password: env.REDIS_PASSWORD,
        }),
      ),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: env.POSTGRES_HOST,
      port: env.POSTGRES_PORT,
      username: env.POSTGRES_USER,
      password: env.POSTGRES_PASSWORD,
      database: env.POSTGRES_DB,
      entities: [`${__dirname}/**/*.entity{.js,.ts}`],
      migrations: [`${__dirname}/migrations/{.ts,*js}`],
      migrationsRun: true,
      synchronize: false,
      logging: env.DATABASE_LOG,
    }),

    AuthModule,
    UserModule,
    AdminModule,
    ItemModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true, // Transforma os parâmetros automaticamente
        whitelist: true, // Remove campos não validados
      }),
    },
    AppService,
  ],
})
export class AppModule {}
