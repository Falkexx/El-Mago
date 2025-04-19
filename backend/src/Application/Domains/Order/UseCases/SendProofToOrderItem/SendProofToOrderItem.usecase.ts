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
import { IIMageRepositoryContract } from 'src/Application/Infra/Repositories/ImageRepository/IImage.repository-contract';
import { PayloadType } from '#types';
import { IAffiliateRepositoryContract } from 'src/Application/Infra/Repositories/AffiliateRepository/IAffiliate.repository-contract';
import { IUserRepositoryContract } from 'src/Application/Infra/Repositories/UserRepository/IUserRepository.contract';
import { TransactionProducer } from 'src/Application/Infra/Jobs/Producer/Transaction.producer';
import { DataSource } from 'typeorm';

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
    private readonly transactionProducer: TransactionProducer,
    private readonly dataSource: DataSource,
  ) {}

  async execute(
    payload: PayloadType,
    sendProofToOrderItemDto: SendProofToOrder,
  ) {
    const trx = this.dataSource.createQueryRunner();

    try {
      await trx.startTransaction();

      const user = await this.userRepository.getBy(
        {
          id: payload.sub,
        },
        trx,
      );

      if (!user || user.isDeleted) {
        throw new UnauthorizedException();
      }

      const order = await this.orderRepository.getBy(
        {
          id: sendProofToOrderItemDto.orderId,
        },
        trx,
      );

      if (!order) {
        throw new NotFoundException('order not found');
      }

      const affiliate = await this.affiliateRepository.getBy(
        {
          userId: payload.sub,
        },
        trx,
      );

      if (!affiliate) {
        throw new ForbiddenException('only affiliate to be access');
      }

      if (affiliate.id !== order.affiliateId) {
        throw new ForbiddenException('this order belongs to another affiliate');
      }

      if (order.proofOfDelivery) {
        throw new NotAcceptableException('proof cannot be sent again');
      }

      const items = await this.orderRepository.getItemsByOrderId(order.id, trx);

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
        trx,
      );

      await this.transactionProducer.makeDeposit({
        orderId: orderUpdated.id,
      });

      await trx.commitTransaction();

      return orderUpdated;
    } catch (e) {
      await trx.rollbackTransaction();
      throw e;
    } finally {
      await trx.release();
    }
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
