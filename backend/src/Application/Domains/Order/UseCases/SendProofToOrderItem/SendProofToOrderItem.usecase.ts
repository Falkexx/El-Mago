import {
  ForbiddenException,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { SendProofToOrderItemDto } from './SendProofToOrdemItem.dto';
import { KEY_INJECTION } from 'src/@metadata/keys';
import { IOrderRepositoryContract } from 'src/Application/Infra/Repositories/OrderRepository/IOrderRepository.contract';
import { StorageService } from 'src/Application/Infra/Storage/Storage.service';
import { ImageEntity } from 'src/Application/Entities/Image.entity';
import { shortId } from '#utils';
import { STORAGE_PROVIDER } from 'src/@metadata';
import { IIMageRepositoryContract } from 'src/Application/Infra/Repositories/ImageRepository/IImage.repository-contract';
import { PayloadType } from '#types';
import { IAffiliateRepositoryContract } from 'src/Application/Infra/Repositories/AffiliateRepository/IAffiliate.repository-contract';

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
  ) {}

  async execute(
    payload: PayloadType,
    sendProofToOrderItemDto: SendProofToOrderItemDto,
  ) {
    const order = await this.orderRepository.getBy({
      id: sendProofToOrderItemDto.orderId,
    });

    if (!order) {
      throw new NotFoundException('order not found');
    }

    if (order.completedAt) {
      throw new NotAcceptableException('order already completed');
    }

    const affiliate = await this.affiliateRepository.getBy({
      userId: payload.sub,
    });

    if (!affiliate || affiliate.isSoftDelete) {
      throw new ForbiddenException(
        'only affiliate must be access  this method',
      );
    }

    if (order.affiliateId !== payload.sub) {
      throw new ForbiddenException('this order belongs to outher affiliate');
    }

    const orderItemExist = await order.OrderItems.find(
      (_item_) => _item_.id === sendProofToOrderItemDto.orderItemId,
    );

    if (!orderItemExist) {
      throw new NotFoundException('item on order not found');
    }

    const image = sendProofToOrderItemDto.image;

    const storageResult = await this.storageService.upload({
      type: 'IMAGE',
      bucket: 'bucket-of-test',
      file: image,
      mimetype: image.mimetype,
      name: image.originalname,
    });

    const imageEntity = Object.assign(new ImageEntity(), {
      id: shortId(),
      bucket: storageResult.Bucket,
      createdAt: new Date(),
      isDeleted: false,
      item: null,
      mimeType: image.mimetype,
      name: image.originalname,
      ProofImage: {
        id: sendProofToOrderItemDto.orderItemId,
      },
      storageProvider: STORAGE_PROVIDER.LOCAL,
      updatedAt: new Date(),
      url: storageResult.Location,
    } as ImageEntity);

    const imageSaved = await this.imageRepository.create(imageEntity);

    const teste = await this.orderRepository.updateOrderItem(
      sendProofToOrderItemDto.orderItemId,
      {
        quantity: 1,
      },
    );

    return {
      teste: teste,
      image: imageSaved,
    };
  }
}
