import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AffiliateEntity,
  AffiliateEntityUniqueRefs,
  AffiliateUpdateEntity,
} from 'src/Application/Entities/Affiliate.entity';
import { Repository } from 'typeorm';
import { IAffiliateRepositoryContract } from './IAffiliate.repository-contract';
import { PaginationResult } from '#types';
import { splitKeyAndValue } from '#utils';
import { GenericPaginationDto } from 'src/utils/validators';
import { TABLE } from 'src/@metadata/tables';

@Injectable()
export class AffiliateTypeOrmRepository
  implements IAffiliateRepositoryContract
{
  constructor(
    @InjectRepository(AffiliateEntity)
    private readonly affiliateRepository: Repository<AffiliateEntity>,
  ) {}

  async create(entity: AffiliateEntity): Promise<AffiliateEntity> {
    try {
      const affiliateTypeOrmEntity = this.affiliateRepository.create(entity);

      const affiliateCreated = await this.affiliateRepository.save(
        affiliateTypeOrmEntity,
      );

      return affiliateCreated;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getBy(unqRef: AffiliateEntityUniqueRefs): Promise<AffiliateEntity> {
    const [key, value] = splitKeyAndValue(unqRef);

    const affiliate = await this.affiliateRepository.findOneBy({
      [key]: value,
    });

    return affiliate ?? null;
  }

  async update(
    unqRef: AffiliateEntityUniqueRefs,
    updateEntity: AffiliateUpdateEntity,
  ): Promise<AffiliateEntity> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const affiliateToUpdate = await this.affiliateRepository.findOne({
        where: { [key]: value },
      });

      const newAffiliate = Object.assign(affiliateToUpdate, {
        ...updateEntity,
      } as AffiliateUpdateEntity);

      const affiliateUpdated =
        await this.affiliateRepository.save(newAffiliate);

      return affiliateUpdated;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async delete(unqRef: AffiliateEntityUniqueRefs): Promise<void> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      await this.affiliateRepository.delete({ [key]: value });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async softDelete(
    unqRef: AffiliateEntityUniqueRefs,
  ): Promise<'success' | 'fail'> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      await this.affiliateRepository.delete({ [key]: value });
      return 'success';
    } catch {
      return 'fail';
    }
  }

  getAll(): Promise<AffiliateEntity[]> {
    return this.affiliateRepository.find();
  }

  async getWithPaginationAndFilters(
    paginationDto: GenericPaginationDto,
  ): Promise<PaginationResult<AffiliateEntity[]>> {
    const { page, limit, search, filters, order } = paginationDto;

    const queryBuilder = this.affiliateRepository.createQueryBuilder(
      TABLE.affiliate,
    );
    if (search) {
      queryBuilder.andWhere(
        `SIMILARITY(${TABLE.affiliate}.name, :search) > 0.3`,
        {
          search: `%${search}`,
        },
      );
    }

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        queryBuilder.andWhere(`${TABLE.affiliate}.${key} = :${key}`, {
          [key]: value,
        });
      });
    }

    queryBuilder.orderBy(`${TABLE.affiliate}.createdAt`, order || 'DESC');

    const [affiliates, total] = await queryBuilder
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();

    return {
      data: affiliates,
      page,
      limit,
      total,
      order,
    };
  }
}
