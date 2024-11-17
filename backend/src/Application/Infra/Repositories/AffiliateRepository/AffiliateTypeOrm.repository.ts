import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AffiliateEntity,
  AffiliateEntityUniqueRefs,
  AffiliateUpdateEntity,
} from 'src/Application/Entities/Affiliate.entity';
import { Repository } from 'typeorm';
import { IAffiliateRepositoryContract } from './IAffiliate.repository-contract';
import { PaginationProps, PaginationResult } from '#types';
import { splitKeyAndValue } from '#utils';

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

  async getMany(
    pagination: PaginationProps,
  ): Promise<{ data: AffiliateEntity[]; pagination: PaginationResult }> {
    const [data, total] = await this.affiliateRepository.findAndCount({
      skip: (pagination.skip - 1) * pagination.take,
      take: pagination.take,
    });

    return {
      data,
      pagination: {
        total,
        ...pagination,
      },
    };
  }

  getAll(): Promise<AffiliateEntity[]> {
    return this.affiliateRepository.find();
  }
}
