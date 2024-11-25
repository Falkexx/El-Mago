import {
  ForbiddenException,
  Inject,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dtos/CreateCategory.dto';
import { KEY_INJECTION } from 'src/@metadata/keys';
import { ICategoryRepositoryContract } from 'src/Application/Infra/Repositories/Category/ICategory.repository-contract';
import { CategoryEntity } from 'src/Application/Entities/Category.entity';
import { shortId } from '#utils';
import { Auth } from '#types';
import { IUserRepositoryContract } from 'src/Application/Infra/Repositories/UserRepository/IUserRepository.contract';
import { ROLE } from 'src/@metadata/roles';
import { GenericPaginationDto } from 'src/utils/validators';

@Injectable()
export class CategoryService {
  constructor(
    @Inject(KEY_INJECTION.USER_REPOSITORY_CONTRACT)
    private readonly userRepository: IUserRepositoryContract,
    @Inject(KEY_INJECTION.CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepositoryContract,
  ) {}

  async create(auth: Auth, categoryDto: CreateCategoryDto) {
    if (!auth.roles.includes(ROLE.ADMIN)) {
      throw new ForbiddenException('you not have permission');
    }

    const categoryExist = await this.categoryRepository.getBy({
      name: categoryDto.name,
    });

    if (categoryExist) {
      throw new NotAcceptableException('category already exist');
    }

    const categoryEntity = Object.assign(new CategoryEntity(), {
      id: shortId(),
      name: categoryDto.name,
      description: categoryDto.description,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      Items: [],
    } as CategoryEntity);

    const categoryCreated =
      await this.categoryRepository.create(categoryEntity);

    return categoryCreated;
  }

  async findWithPaginationAndFilters(paginationDto: GenericPaginationDto) {
    return this.categoryRepository.getWithPaginationAndFilters(paginationDto);
  }
}
