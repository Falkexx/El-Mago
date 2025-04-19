import { PayloadType } from '#types';
import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { KEY_INJECTION } from 'src/@metadata/keys';
import { OrderEntity } from 'src/Application/Entities/Order.entity';
import { IAffiliateRepositoryContract } from 'src/Application/Infra/Repositories/AffiliateRepository/IAffiliate.repository-contract';
import { IOrderRepositoryContract } from 'src/Application/Infra/Repositories/OrderRepository/IOrderRepository.contract';
import { IUserRepositoryContract } from 'src/Application/Infra/Repositories/UserRepository/IUserRepository.contract';
import { GenericPaginationDto } from 'src/utils/validators';
import { DataSource } from 'typeorm';

@Injectable()
export class GetMyCurrentOrdersAsAffiliate {
  constructor(
    @Inject(KEY_INJECTION.USER_REPOSITORY_CONTRACT)
    private readonly userRepository: IUserRepositoryContract,
    @Inject(KEY_INJECTION.AFFILIATE_REPOSITORY_CONTRACT)
    private readonly affiliateRepository: IAffiliateRepositoryContract,
    @Inject(KEY_INJECTION.ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepositoryContract,
    private readonly dataSource: DataSource,
  ) {}

  async execute(payload: PayloadType, paginationDto: GenericPaginationDto) {
    const trx = this.dataSource.createQueryRunner();

    try {
      await trx.startTransaction();

      const user = await this.userRepository.getBy({ id: payload.sub }, trx);

      if (!user) {
        throw new UnauthorizedException();
      }

      const affiliate = await this.affiliateRepository.getBy(
        {
          id: user.affiliateId,
        },
        trx,
      );

      if (!affiliate || affiliate.deletedAt) {
        throw new ForbiddenException('affiliate not exist or was deleted');
      }

      const orders = await this.orderRepository.getWithPaginationAndFilters(
        {
          ...paginationDto,
          filters: {
            ...paginationDto.filters,
            // proofOfDelivery: null,
            affiliateId: affiliate.id,
          } as OrderEntity,
        },
        trx,
      );

      await trx.commitTransaction();

      return orders;
    } catch (e) {
      await trx.rollbackTransaction();
      throw e;
    } finally {
      await trx.release();
    }
  }
}
