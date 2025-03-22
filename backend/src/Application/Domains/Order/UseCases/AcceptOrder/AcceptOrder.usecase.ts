import {
  ForbiddenException,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { KEY_INJECTION } from 'src/@metadata/keys';
import { IOrderRepositoryContract } from 'src/Application/Infra/Repositories/OrderRepository/IOrderRepository.contract';
import { AcceptOrderDto } from './AcceptOrder.dto';
import { PayloadType } from '#types';
import { IUserRepositoryContract } from 'src/Application/Infra/Repositories/UserRepository/IUserRepository.contract';
import { IAffiliateRepositoryContract } from 'src/Application/Infra/Repositories/AffiliateRepository/IAffiliate.repository-contract';

@Injectable()
export class AcceptOrderUseCase {
  constructor(
    @Inject(KEY_INJECTION.USER_REPOSITORY_CONTRACT)
    private readonly userRepository: IUserRepositoryContract,
    @Inject(KEY_INJECTION.ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepositoryContract,
    @Inject(KEY_INJECTION.AFFILIATE_REPOSITORY_CONTRACT)
    private readonly affiliateRepository: IAffiliateRepositoryContract,
  ) {}

  async execute(payload: PayloadType, addAffiliateOnOrderDto: AcceptOrderDto) {
    const user = await this.userRepository.getBy({ id: payload.sub });

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!user.affiliateId) {
      throw new ForbiddenException('only affiliate make this action');
    }

    const availableOrder = await this.orderRepository.getAvailableOrder(
      addAffiliateOnOrderDto.orderId,
    );

    console.log(availableOrder);

    if (!availableOrder) {
      throw new NotFoundException('order not found');
    }

    if (availableOrder.completedAt) {
      throw new NotAcceptableException('the order has already been completed');
    }

    // if (availableOrder.Affiliate || availableOrder['affiliateId']) {
    //   throw new NotAcceptableException('already affiliate in this order');
    // }

    // const orderUpdated = await this.orderRepository.update(
    //   {
    //     id: availableOrder.id,
    //   },
    //   {
    //     Affiliate: affiliate,
    //   },
    // );

    // return orderUpdated;
  }
}
