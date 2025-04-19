import { PayloadType } from '#types';
import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { KEY_INJECTION } from 'src/@metadata/keys';
import { ICartRepositoryContract } from 'src/Application/Infra/Repositories/CartRepository/ICartRepository.contract';
import { IUserRepositoryContract } from 'src/Application/Infra/Repositories/UserRepository/IUserRepository.contract';
import { DataSource } from 'typeorm';

@Injectable()
export class GetCartUseCase {
  constructor(
    @Inject(KEY_INJECTION.USER_REPOSITORY_CONTRACT)
    private readonly userRepository: IUserRepositoryContract,

    @Inject(KEY_INJECTION.CART_REPOSITORY)
    private readonly cartRepository: ICartRepositoryContract,

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

      const cart = await this.cartRepository.getBy({ userId: user.id }, trx);

      if (!cart) {
        throw new NotFoundException('user not have cart');

        //then create a new cart to user
      }

      await trx.commitTransaction();

      return cart;
    } catch (e) {
      await trx.rollbackTransaction();
      throw e;
    } finally {
      await trx.release();
    }
  }
}
