import { PayloadType } from '#types';
import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { KEY_INJECTION } from 'src/@metadata/keys';
import { IOrderRepositoryContract } from 'src/Application/Infra/Repositories/OrderRepository/IOrderRepository.contract';
import { IUserRepositoryContract } from 'src/Application/Infra/Repositories/UserRepository/IUserRepository.contract';

export type GetOrderAsAffiliateUseCaseResult = {};

@Injectable()
export class GetOrderAsAffiliateUseCase {
  constructor(
    @Inject(KEY_INJECTION.ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepositoryContract,
    @Inject(KEY_INJECTION.USER_REPOSITORY_CONTRACT)
    private readonly userRepository: IUserRepositoryContract,
  ) {}

  async execute(payload: PayloadType) {
    const user = await this.userRepository.getBy({ id: payload.sub });

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!user.affiliateId) {
      throw new ForbiddenException();
    }

    const orders = await this.orderRepository.getAvailableOrdersToAccept();

    return {
      availableOrders: orders,
    };
  }
}
