import { Module } from '@nestjs/common';
import { CategoryController } from './Category.controller';
import { CategoryService } from './Category.service';
import { RepositoriesModule } from 'src/Application/Infra/Repositories/Repositories.module';
import { KEY_INJECTION } from 'src/@metadata/keys';
import { CategoryTypeOrmRepository } from 'src/Application/Infra/Repositories/Category/CategoryTypeorm.repository';
import { UserTypeOrmRepository } from 'src/Application/Infra/Repositories/UserRepository/UserTypeOrm.repository';

@Module({
  imports: [RepositoriesModule],
  controllers: [CategoryController],
  providers: [
    {
      provide: KEY_INJECTION.USER_REPOSITORY_CONTRACT,
      useClass: UserTypeOrmRepository,
    },
    {
      provide: KEY_INJECTION.CATEGORY_REPOSITORY,
      useClass: CategoryTypeOrmRepository,
    },
    CategoryService,
  ],
})
export class CategoryModule {}
