import { ItemEntity } from 'src/Application/Entities/Item.entity';
import { CreateItemDto } from './CrateItem.dto';
import { generateImageId, shortId } from '#utils';
import { BUCKET_NAME, ItemType } from 'src/@metadata';
import { ImageEntity } from 'src/Application/Entities/Image.entity';
import {
  Inject,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { KEY_INJECTION } from 'src/@metadata/keys';
import { IUserRepositoryContract } from 'src/Application/Infra/Repositories/UserRepository/IUserRepository.contract';
import { Auth } from '#types';
import { IItemRepositoryContract } from 'src/Application/Infra/Repositories/ItemRepository/IItem.repository-contract';
import { IIMageRepositoryContract } from 'src/Application/Infra/Repositories/ImageRepository/IImage.repository-contract';
import { ROLE } from 'src/@metadata/roles';
import { ICategoryRepositoryContract } from 'src/Application/Infra/Repositories/Category/ICategory.repository-contract';
import { S3Service } from 'src/Application/Infra/Storage/Providers/S3.service';
import { ManagedUpload } from 'aws-sdk/clients/s3';

export class CreateItemService {
  constructor(
    @Inject(KEY_INJECTION.USER_REPOSITORY_CONTRACT)
    private readonly userRepository: IUserRepositoryContract,
    @Inject(KEY_INJECTION.ITEM_REPOSITORY_CONTRACT)
    private readonly itemRepository: IItemRepositoryContract,
    @Inject(KEY_INJECTION.IMAGE_REPOSITORY_CONTRACT)
    private readonly imageRepository: IIMageRepositoryContract,
    @Inject(KEY_INJECTION.CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepositoryContract,
    private readonly s3Service: S3Service,
  ) {}

  async execute(auth: Auth, createItemDto: CreateItemDto) {
    const user = await this.userRepository.getBy({ id: auth.id });

    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.role !== ROLE.ADMIN && createItemDto.type === ItemType.COMMON) {
      throw new UnauthorizedException('only admin must be create common item');
    }

    const category = await this.categoryRepository.getBy({
      id: createItemDto.categoryId,
    });

    if (!category) {
      throw new NotFoundException('category not found');
    }

    const imageId = shortId();

    const uploadResult: ManagedUpload.SendData = await this.s3Service.upload({
      file: createItemDto.image,
      bucket: BUCKET_NAME.ITEM_IMAGE_BUCKET,
      mimetype: createItemDto.image.mimetype,
      name: generateImageId(createItemDto.image.originalname),
    });

    console.log(uploadResult);

    const imageEntity = Object.assign(new ImageEntity(), {
      id: imageId,
      name: createItemDto.image.originalname,
      bucket: uploadResult.Bucket,
      mimeType: createItemDto.image.mimetype,
      isDeleted: false,
      storageProvider: 'S3',
      updatedAt: new Date(),
      url: uploadResult.Location,
      item: undefined,
      createdAt: new Date(),
    } as ImageEntity);

    const imageCrated = await this.imageRepository.create(imageEntity);

    const itemEntity = Object.assign(new ItemEntity(), {
      id: shortId(),
      name: createItemDto.name,
      description: createItemDto.description,
      type: createItemDto.type,
      amount:
        createItemDto.type !== ItemType.COMMON ? createItemDto.amount : null,
      isInfinite: createItemDto.type === ItemType.COMMON,
      price: createItemDto.price,
      softDeleted: false,
      image: imageCrated,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: user,
      tags: createItemDto.tags,
      Category: category,
    } as ItemEntity);

    const itemCreated = await this.itemRepository.create(itemEntity);

    return itemCreated;
  }
}
