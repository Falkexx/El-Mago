import { Module } from '@nestjs/common';
import { AuthController } from './Auth.controller';
import { AuthService } from './Auth.service';
import { UserModule } from '../User/User.module';
import { JwtModule } from '@nestjs/jwt';
import { env } from '#utils';
import { KEY_INJECTION } from 'src/@metadata/keys';
import { UserTypeOrmRepository } from 'src/Application/Infra/Repositories/UserRepository/UserTypeOrm.repository';
import { RepositoriesModule } from 'src/Application/Infra/Repositories/Repositories.module';
import { CartTypeOrmRepository } from 'src/Application/Infra/Repositories/CartRepository/CartTypeOrm.repository';

@Module({
  imports: [
    JwtModule.register({
      secret: env.JWT_SECRET,
      verifyOptions: {
        ignoreExpiration: false,
      },
      signOptions: {
        expiresIn: env.JWT_EXPIRES_IN,
      },
      global: true,
    }),
    UserModule,
    RepositoriesModule,
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: KEY_INJECTION.USER_REPOSITORY_CONTRACT,
      useClass: UserTypeOrmRepository,
    },
    {
      provide: KEY_INJECTION.CART_REPOSITORY,
      useClass: CartTypeOrmRepository,
    },
    AuthService,
  ],
})
export class AuthModule {}
