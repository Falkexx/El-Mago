import { PayloadType } from '#types';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { KEY_INJECTION } from 'src/@metadata/keys';
import { IOrderRepositoryContract } from 'src/Application/Infra/Repositories/OrderRepository/IOrderRepository.contract';
import { IUserRepositoryContract } from 'src/Application/Infra/Repositories/UserRepository/IUserRepository.contract';
import { GenericPaginationDto } from 'src/utils/validators';

@Injectable()
export class GetOrderByAuthUseCase {
  constructor(
    @Inject(KEY_INJECTION.USER_REPOSITORY_CONTRACT)
    private readonly userRepository: IUserRepositoryContract,
    @Inject(KEY_INJECTION.ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepositoryContract,
  ) {}

  async execute(payload: PayloadType, pagination: GenericPaginationDto) {
    const user = await this.userRepository.getBy({ id: payload.sub });

    if (!user) {
      throw new UnauthorizedException();
    }

    const orders = await this.orderRepository.getWithPaginationAndFilters({
      filters: { ...pagination.filters, userId: user.id }, // force always search for the authenticated user
      order: pagination.order,
      limit: pagination.limit,
      page: pagination.page,
      search: pagination.search,
    });

    return orders;
  }
}
