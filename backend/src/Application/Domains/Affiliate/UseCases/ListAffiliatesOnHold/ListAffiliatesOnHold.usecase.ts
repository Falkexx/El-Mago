import { Inject, Injectable } from '@nestjs/common';
import { KEY_INJECTION } from 'src/@metadata/keys';
import { IRequestAffiliateRepositoryContract } from 'src/Application/Infra/Repositories/RequestAffiliate/IRequestAffiliate.repository-contract';
import { GenericPaginationDto } from 'src/utils/validators';
import { DataSource } from 'typeorm';

@Injectable()
export class ListAffiliatesOnHoldUseCase {
  constructor(
    @Inject(KEY_INJECTION.REQUEST_AFFILIATE_REPOSITORY)
    private readonly reqAffiliateRepository: IRequestAffiliateRepositoryContract,
    private readonly dataSource: DataSource,
  ) {}

  async execute(pagination: GenericPaginationDto) {
    const trx = this.dataSource.createQueryRunner();

    try {
      await trx.commitTransaction();

      const affiliatesOnTheWaitingList =
        await this.reqAffiliateRepository.getWithPaginationAndFilters(
          pagination,
          trx,
        );

      return affiliatesOnTheWaitingList;
    } catch (e) {
      await trx.rollbackTransaction();
    } finally {
      await trx.release();
    }
  }
}
