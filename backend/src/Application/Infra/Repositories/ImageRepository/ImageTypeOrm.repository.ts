import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ImageEntity,
  ImageUniqueRef,
  ImageUpdateEntity,
} from 'src/Application/Entities/Image.entity';
import { GenericPaginationDto } from 'src/utils/validators';
import { PaginationResult } from '#types';
import { IIMageRepositoryContract } from './IImage.repository-contract';
import { splitKeyAndValue } from '#utils';
import { TABLE } from 'src/@metadata/tables';

@Injectable()
export class ImageTypeormRepository implements IIMageRepositoryContract {
  constructor(
    @InjectRepository(ImageEntity)
    private readonly imageRepository: Repository<ImageEntity>,
  ) {}

  async create(entity: ImageEntity): Promise<ImageEntity> {
    try {
      const imageEntity = this.imageRepository.create(entity);
      const imageCreated = await this.imageRepository.save(imageEntity);
      return imageCreated;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getBy(unqRef: ImageUniqueRef): Promise<ImageEntity | null> {
    const [key, value] = splitKeyAndValue(unqRef);

    const image = await this.imageRepository.findOneBy({ [key]: value });
    return image ?? null;
  }

  async update(
    unqRef: ImageUniqueRef,
    updateEntity: ImageUpdateEntity,
  ): Promise<ImageEntity> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const imageToUpdate = await this.imageRepository.findOne({
        where: { [key]: value },
      });

      if (!imageToUpdate) {
        throw new InternalServerErrorException('Image not found');
      }

      const newImage = Object.assign(imageToUpdate, updateEntity);

      const imageUpdated = await this.imageRepository.save(newImage);

      return imageUpdated;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async delete(unqRef: ImageUniqueRef): Promise<void> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      await this.imageRepository.delete({ [key]: value });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async softDelete(unqRef: ImageUniqueRef): Promise<'success' | 'fail'> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      await this.imageRepository.softDelete({ [key]: value });
      return 'success';
    } catch {
      return 'fail';
    }
  }

  async getAll(): Promise<ImageEntity[]> {
    try {
      return this.imageRepository.find();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getWithPaginationAndFilters(
    paginationDto: GenericPaginationDto,
  ): Promise<PaginationResult<ImageEntity[]>> {
    const { page, limit, search, filters, order } = paginationDto;

    const queryBuilder = this.imageRepository.createQueryBuilder(TABLE.image);

    if (search) {
      queryBuilder.andWhere(`SIMILARITY(${TABLE.image}.name, :search) > 0.3`, {
        search: `%${search}%`,
      });
    }

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        queryBuilder.andWhere(`${TABLE.image}.${key} = :${key}`, {
          [key]: value,
        });
      });
    }

    queryBuilder.orderBy(`${TABLE.image}.createdAt`, order || 'DESC');

    try {
      const [images, total] = await queryBuilder
        .take(limit)
        .skip((page - 1) * limit)
        .getManyAndCount();

      return {
        data: images,
        page,
        limit,
        total,
        order,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }
}
