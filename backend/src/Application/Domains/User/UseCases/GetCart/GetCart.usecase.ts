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

@Injectable()
export class GetCartUseCase {
  constructor(
    @Inject(KEY_INJECTION.USER_REPOSITORY_CONTRACT)
    private readonly userRepository: IUserRepositoryContract,

    @Inject(KEY_INJECTION.CART_REPOSITORY)
    private readonly cartRepository: ICartRepositoryContract,
  ) {}

  async execute(payload: PayloadType) {
    const user = await this.userRepository.getBy({ id: payload.sub });

    if (!user) {
      throw new UnauthorizedException();
    }

    const cart = await this.cartRepository.getBy({ userId: user.id });

    if (!cart) {
      throw new NotFoundException('user not have cart');

      //then create a new cart to user
    }

    return cart;
  }
}
