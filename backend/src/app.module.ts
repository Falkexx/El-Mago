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
import { OrderModule } from './Application/Domains/Order/Order.module';
import { CacheModule } from '@nestjs/cache-manager';
import { InfraCredentialsManagerModule } from './Application/Infra/InfraCredentialsManager/InfraCredentialsManager.module';
import { BullModule } from '@nestjs/bullmq';
import { JobsModule } from './Application/Infra/Jobs/Job.module';
import { WalletModule } from './Application/Domains/Wallet/Wallet.module';
import { CaryRunModule } from './Application/Domains/CaryRun/CaryRun.module';
import { GameServerModule } from './Application/Domains/GameServer/GameServer.module';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
        password: env.REDIS_PASSWORD,
      },
    }),

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
      // migrations: [`${__dirname}/migrations/{.ts,*js}`],
      migrationsRun: true,
      synchronize: true,
      logging: env.DATABASE_LOG,
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    InfraCredentialsManagerModule,

    AuthModule,
    UserModule,
    AdminModule,
    ItemModule,
    CategoryModule,
    OrderModule,
    JobsModule,
    WalletModule,
    CaryRunModule,
    GameServerModule,
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
