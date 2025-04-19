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
import { GenericPaginationDto } from 'src/utils/validators';
import { DataSource } from 'typeorm';

export type GetOrderAsAffiliateUseCaseResult = {};

@Injectable()
export class GetOrderAsAffiliateUseCase {
  constructor(
    @Inject(KEY_INJECTION.ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepositoryContract,
    @Inject(KEY_INJECTION.USER_REPOSITORY_CONTRACT)
    private readonly userRepository: IUserRepositoryContract,
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

      if (!user.affiliateId) {
        throw new ForbiddenException();
      }

      const result = await this.orderRepository.getAvailableOrdersToAccept(
        paginationDto,
        trx,
      );

      await trx.commitTransaction();

      return {
        orders: result.data,
        meta: result.meta,
      };
    } catch (e) {
      await trx.rollbackTransaction();
      throw e;
    } finally {
      await trx.release();
    }
  }
}
