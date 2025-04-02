import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SendProofToOrder } from './SendProofToOrdemItem.dto';
import { KEY_INJECTION } from 'src/@metadata/keys';
import { IOrderRepositoryContract } from 'src/Application/Infra/Repositories/OrderRepository/IOrderRepository.contract';
import { StorageService } from 'src/Application/Infra/Storage/Storage.service';
import { ImageEntity } from 'src/Application/Entities/Image.entity';
import { shortId } from '#utils';
import { STORAGE_PROVIDER } from 'src/@metadata';
import { IIMageRepositoryContract } from 'src/Application/Infra/Repositories/ImageRepository/IImage.repository-contract';
import { PayloadType } from '#types';
import { IAffiliateRepositoryContract } from 'src/Application/Infra/Repositories/AffiliateRepository/IAffiliate.repository-contract';
import { IUserRepositoryContract } from 'src/Application/Infra/Repositories/UserRepository/IUserRepository.contract';

@Injectable()
export class SendProofToOrderItemUseCase {
  constructor(
    @Inject(KEY_INJECTION.ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepositoryContract,
    private readonly storageService: StorageService,
    @Inject(KEY_INJECTION.AFFILIATE_REPOSITORY_CONTRACT)
    private readonly affiliateRepository: IAffiliateRepositoryContract,
    @Inject(KEY_INJECTION.IMAGE_REPOSITORY_CONTRACT)
    private readonly imageRepository: IIMageRepositoryContract,
    @Inject(KEY_INJECTION.USER_REPOSITORY_CONTRACT)
    private readonly userRepository: IUserRepositoryContract,
  ) {}

  async execute(
    payload: PayloadType,
    sendProofToOrderItemDto: SendProofToOrder,
  ) {
    const user = await this.userRepository.getBy({
      id: payload.sub,
    });

    if (!user || user.isDeleted) {
      throw new UnauthorizedException();
    }

    const order = await this.orderRepository.getBy({
      id: sendProofToOrderItemDto.orderId,
    });

    if (!order) {
      throw new NotFoundException('order not found');
    }

    const affiliate = await this.affiliateRepository.getBy({
      userId: payload.sub,
    });

    if (!affiliate) {
      throw new ForbiddenException('only affiliate to be access');
    }

    const items = await this.orderRepository.getItemsByOrderId(order.id);
    const itemsIds = items.map((item) => item.id);

    if (items.length <= 0) {
      throw new InternalServerErrorException('items not found');
    }

    const itemsIdsDto = sendProofToOrderItemDto.items.map((item) => item.id);

    if (!this.comparArrays(itemsIds, itemsIdsDto)) {
      throw new NotAcceptableException('some items is invalid');
    }

    const proofOfDelivery = sendProofToOrderItemDto.items.map(
      (item) =>
        ({
          itemId: item.id,
          imageUrl: item.imageUrl,
          createdAt: new Date(),
        }) as { itemId: string; imageUrl: string; createdAt: Date },
    );

    const orderUpdated = await this.orderRepository.update(
      { id: order.id },
      {
        proofOfDelivery: proofOfDelivery,
      },
    );

    return orderUpdated;
  }

  private comparArrays(arr1: Array<any>, arr2: Array<any>) {
    if (arr1.length !== arr2.length) return false;

    const shortedArr1 = [...arr1].sort();
    const shortedArr2 = [...arr2].sort();

    return shortedArr1.every(
      (element, index) => element === shortedArr2[index],
    );
  }
}
