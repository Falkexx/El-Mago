import { CreateItemDto } from './CrateItem.dto';
import { generateImageId, generateShortId, shortId } from '#utils';
import { ItemType, STORAGE_PROVIDER } from 'src/@metadata';
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
import { env } from 'process';

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

    if (
      !user.roles.includes(ROLE.ADMIN) &&
      createItemDto.type === ItemType.COMMON
    ) {
      throw new UnauthorizedException('only admin must be create common item');
    }

    const category = await this.categoryRepository.getBy({
      id: createItemDto.categoryId,
    });

    if (!category) {
      throw new NotFoundException('category not found');
    }

    const imageId = generateShortId(20);

    const imageUploadResult = await this.storageService.upload({
      bucket: env.PUBLIC_IMAGES_BUCKET_NAME,
      file: createItemDto.image,
      mimetype: createItemDto.image.mimetype,
      name: generateImageId(createItemDto.image.originalname),
      type: 'IMAGE',
    });

    const imageCrated = await this.imageRepository.create({
      id: imageId,
      name: createItemDto.image.originalname,
      bucket: imageUploadResult.Bucket,
      mimeType: createItemDto.image.mimetype,
      isDeleted: false,
      storageProvider: STORAGE_PROVIDER.S3,
      updatedAt: new Date(),
      url: imageUploadResult.Location,
      createdAt: new Date(),
    });

    const itemCreated = await this.itemRepository.create({
      id: generateShortId(20),
      name: createItemDto.name,
      description: createItemDto.description,
      type: createItemDto.type,
      amount:
        createItemDto.type !== ItemType.COMMON ? createItemDto.amount : null,
      isInfinite: createItemDto.type === ItemType.COMMON,
      price: createItemDto.price,
      softDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      imageUrl: imageCrated.url,
      tags: createItemDto.tags,
      Categories: [category],
      user: user,
      CartItems: undefined,
      OrderItem: undefined,
    });

    return itemCreated;
  }
}
