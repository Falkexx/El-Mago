import { Inject, Injectable } from '@nestjs/common';
import { KEY_INJECTION } from 'src/@metadata/keys';
import { IRequestAffiliateRepositoryContract } from 'src/Application/Infra/Repositories/RequestAffiliate/IRequestAffiliate.repository-contract';
import { GenericPaginationDto } from 'src/utils/validators';

@Injectable()
export class ListAffiliatesOnHoldUseCase {
  constructor(
    @Inject(KEY_INJECTION.REQUEST_AFFILIATE_REPOSITORY)
    private readonly reqAffiliateRepository: IRequestAffiliateRepositoryContract,
  ) {}

  async execute(pagination: GenericPaginationDto) {
    const affiliatesOnTheWaitingList =
      await this.reqAffiliateRepository.getWithPaginationAndFilters(pagination);

    return affiliatesOnTheWaitingList;
  }
}
