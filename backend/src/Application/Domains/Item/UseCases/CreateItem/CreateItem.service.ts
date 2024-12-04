import { ItemEntity } from 'src/Application/Entities/Item.entity';
import { CreateItemDto } from './CrateItem.dto';
import { generateImageId, shortId } from '#utils';
import { ItemType } from 'src/@metadata';
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
import { StorageService } from 'src/Application/Infra/Storage/Storage.service';

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
    private readonly storageService: StorageService,
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

    const imageUploadResult = await this.storageService.upload({
      bucket: 'item-images-bucket-teste',
      file: createItemDto.image,
      mimetype: createItemDto.image.mimetype,
      name: generateImageId(createItemDto.image.originalname),
      type: 'IMAGE',
    });

    const imageEntity = Object.assign(new ImageEntity(), {
      id: imageId,
      name: createItemDto.image.originalname,
      bucket: imageUploadResult.Bucket,
      mimeType: createItemDto.image.mimetype,
      isDeleted: false,
      storageProvider: 'S3',
      updatedAt: new Date(),
      url: imageUploadResult.Location,
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
