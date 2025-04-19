import { Inject, Injectable } from '@nestjs/common';
import { KEY_INJECTION } from 'src/@metadata/keys';
import { IItemRepositoryContract } from 'src/Application/Infra/Repositories/ItemRepository/IItem.repository-contract';
import { GenericPaginationDto } from 'src/utils/validators';
import { DataSource } from 'typeorm';

@Injectable()
export class GetManyItemsUseCase {
  constructor(
    @Inject(KEY_INJECTION.ITEM_REPOSITORY_CONTRACT)
    private readonly itemRepository: IItemRepositoryContract,
    private readonly dataSource: DataSource,
  ) {}

  async execute(pagination: GenericPaginationDto) {
    const trx = this.dataSource.createQueryRunner();

    try {
      await trx.startTransaction();

      const items = await this.itemRepository.getWithPaginationAndFilters(
        pagination,
        trx,
      );

      await trx.commitTransaction();

      return items;
    } catch (e) {
      await trx.rollbackTransaction();
      throw e;
    } finally {
      await trx.release();
    }
  }
}
