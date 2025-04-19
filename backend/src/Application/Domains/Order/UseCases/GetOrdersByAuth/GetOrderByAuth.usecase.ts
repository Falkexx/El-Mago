import { PayloadType } from '#types';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { KEY_INJECTION } from 'src/@metadata/keys';
import { IOrderRepositoryContract } from 'src/Application/Infra/Repositories/OrderRepository/IOrderRepository.contract';
import { IUserRepositoryContract } from 'src/Application/Infra/Repositories/UserRepository/IUserRepository.contract';
import { GenericPaginationDto } from 'src/utils/validators';
import { DataSource } from 'typeorm';

@Injectable()
export class GetOrderByAuthUseCase {
  constructor(
    @Inject(KEY_INJECTION.USER_REPOSITORY_CONTRACT)
    private readonly userRepository: IUserRepositoryContract,
    @Inject(KEY_INJECTION.ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepositoryContract,
    private readonly dataSource: DataSource,
  ) {}

  async execute(payload: PayloadType, pagination: GenericPaginationDto) {
    const trx = this.dataSource.createQueryRunner();

    try {
      await trx.startTransaction();

      const user = await this.userRepository.getBy({ id: payload.sub }, trx);

      if (!user) {
        throw new UnauthorizedException();
      }

      const orders = await this.orderRepository.getWithPaginationAndFilters(
        {
          filters: { ...pagination.filters, userId: user.id }, // force always search for the authenticated user
          order: pagination.order,
          limit: pagination.limit,
          page: pagination.page,
          search: pagination.search,
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
