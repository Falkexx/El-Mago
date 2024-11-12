import { Module } from '@nestjs/common';
import { UserTypeOrmRepository } from './UserRepository/UserTypeOrm.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/Application/Entities/User.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserTypeOrmRepository],
  exports: [TypeOrmModule],
})
export class RepositoriesModule {}
