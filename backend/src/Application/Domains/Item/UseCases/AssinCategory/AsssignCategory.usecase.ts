import {
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { KEY_INJECTION } from 'src/@metadata/keys';
import { ICategoryRepositoryContract } from 'src/Application/Infra/Repositories/Category/ICategory.repository-contract';
import { AssignCategoryDto } from './AssignCategory.dto';
import { IItemRepositoryContract } from 'src/Application/Infra/Repositories/ItemRepository/IItem.repository-contract';

@Injectable()
export class AssignCategoryUseCase {
  constructor(
    @Inject(KEY_INJECTION.CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepositoryContract,
    @Inject(KEY_INJECTION.ITEM_REPOSITORY_CONTRACT)
    private readonly itemRepository: IItemRepositoryContract,
  ) {}

  async execute(assignDto: AssignCategoryDto) {
    const category = await this.categoryRepository.getBy({
      id: assignDto.categoryId,
    });

    if (!category) {
      throw new NotFoundException('category not found');
    }

    const item = await this.itemRepository.getOneOptimized(
      { id: assignDto.itemId },
      ['id'],
      ['Categories'],
    );
    if (
      item.Categories.find(
        (_category_) => _category_.id === assignDto.categoryId,
      )
    ) {
      throw new NotAcceptableException('Category already assign');
    }

    // check if have same category in item
    return this.itemRepository.pushCategory({ id: item.id }, category);
  }
}
