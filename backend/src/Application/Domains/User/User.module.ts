import { Module } from '@nestjs/common';
import { UserService } from './User.service';
import { UserController } from './User.controller';
import { RepositoriesModule } from 'src/Application/Infra/Repositories/Repositories.module';
import { KEY_INJECTION } from 'src/@metadata/keys';
import { UserTypeOrmRepository } from 'src/Application/Infra/Repositories/UserRepository/UserTypeOrm.repository';

@Module({
  imports: [RepositoriesModule],
  controllers: [UserController],
  providers: [
    {
      provide: KEY_INJECTION.USER_REPOSITORY_CONTRACT,
      useClass: UserTypeOrmRepository,
    },
    UserService,
  ],
})
export class UserModule {}
