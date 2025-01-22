import { Inject, Injectable } from '@nestjs/common';
import { KEY_INJECTION } from 'src/@metadata/keys';
import { IOrderRepositoryContract } from 'src/Application/Infra/Repositories/OrderRepository/IOrderRepository.contract';

export type GetOrderAsAffiliateUseCaseResult = {};

@Injectable()
export class GetOrderAsAffiliateUseCase {
  constructor(
    @Inject(KEY_INJECTION.ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepositoryContract,
  ) {}

  async execute() {
    const orders = await this.orderRepository.getorOrdersWithOutffiliate();

    return orders;
  }
}
('');
