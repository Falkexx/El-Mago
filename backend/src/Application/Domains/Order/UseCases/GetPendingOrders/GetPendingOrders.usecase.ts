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
import { DataSource } from 'typeorm';

/**@deprecated */
@Injectable()
export class GetPendingOrdersUseCase {
  constructor(
    @Inject(KEY_INJECTION.USER_REPOSITORY_CONTRACT)
    private readonly userRepository: IUserRepositoryContract,
    @Inject(KEY_INJECTION.ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepositoryContract,
    private readonly dataSource: DataSource,
  ) {}

  async execute(payload: PayloadType) {
    const trx = this.dataSource.createQueryRunner();

    try {
      await trx.startTransaction();

      const user = await this.userRepository.getBy({ id: payload.sub }, trx);

      if (!user) {
        throw new UnauthorizedException();
      }

      if (!user.affiliateId) {
        throw new ForbiddenException();
      }

      const ordersPending =
        await this.orderRepository.getPendingOrdersFromAffiliate(
          user.affiliateId,
          trx,
        );

      await trx.commitTransaction();

      return ordersPending;
    } catch (e) {
      await trx.rollbackTransaction();
      throw e;
    } finally {
      await trx.release();
    }
  }
}
