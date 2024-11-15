import { Module } from '@nestjs/common';
import { AuthController } from './Auth.controller';
import { AuthService } from './Auth.service';
import { UserModule } from '../User/User.module';
import { JwtModule } from '@nestjs/jwt';
import { env } from '#utils';

@Module({
  imports: [
    JwtModule.register({
      secret: env.JWT_SECRET,
      verifyOptions: {
        ignoreExpiration: false,
      },
      signOptions: {
        expiresIn: '24h',
      },
      global: true,
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
