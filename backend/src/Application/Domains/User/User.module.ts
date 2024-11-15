import { Module } from '@nestjs/common';
import { UserService } from './User.service';
import { UserController } from './User.controller';
import { RepositoriesModule } from 'src/Application/Infra/Repositories/Repositories.module';
import { KEY_INJECTION } from 'src/@metadata/keys';
import { UserTypeOrmRepository } from 'src/Application/Infra/Repositories/UserRepository/UserTypeOrm.repository';
import { UpdateUserService } from './UpdateUser/UpdateUser.service';

@Module({
  imports: [RepositoriesModule],
  controllers: [UserController],
  providers: [
    {
      provide: KEY_INJECTION.USER_REPOSITORY_CONTRACT,
      useClass: UserTypeOrmRepository,
    },
    UserService,
    UpdateUserService,
  ],
  exports: [UserService],
})
export class UserModule {}
