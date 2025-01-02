import { Inject, Injectable } from '@nestjs/common';
import { KEY_INJECTION } from 'src/@metadata/keys';
import { IItemRepositoryContract } from 'src/Application/Infra/Repositories/ItemRepository/IItem.repository-contract';
import { GenericPaginationDto } from 'src/utils/validators';

@Injectable()
export class GetManyItemsUseCase {
  constructor(
    @Inject(KEY_INJECTION.ITEM_REPOSITORY_CONTRACT)
    private readonly itemRepository: IItemRepositoryContract,
  ) {}

  async execute(pagination: GenericPaginationDto) {
    const items =
      await this.itemRepository.getWithPaginationAndFilters(pagination);

    return items;
  }
}
