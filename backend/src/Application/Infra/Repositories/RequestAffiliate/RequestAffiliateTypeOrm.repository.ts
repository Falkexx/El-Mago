import { PaginationResult } from '#types';
import {
  RequestAffiliateEntity,
  RequestAffiliateUnqRef,
  RequestAffiliateUpdateEntity,
} from 'src/Application/Entities/Request-Affiliate.entity';
import { GenericPaginationDto } from 'src/utils/validators';
import { IRequestAffiliateRepositoryContract } from './IRequestAffiliate.repository-contract';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { splitKeyAndValue } from '#utils';
import { SearchBuilderService } from '../SearchBuilder.service';
import { TABLE } from 'src/@metadata/tables';

@Injectable()
export class RequestAffiliateTypeOrmRepository
  implements IRequestAffiliateRepositoryContract
{
  constructor(
    @InjectRepository(RequestAffiliateEntity)
    private readonly reqAffiliateRepo: Repository<RequestAffiliateEntity>,
    private readonly searchBuilder: SearchBuilderService,
  ) {}

  create(entity: RequestAffiliateEntity): Promise<RequestAffiliateEntity> {
    try {
      const reqAffiliateEntity = this.reqAffiliateRepo.create(entity);

      return this.reqAffiliateRepo.save(reqAffiliateEntity);
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  getBy(unqRef: RequestAffiliateUnqRef): Promise<RequestAffiliateEntity> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      return this.reqAffiliateRepo.findOne({ where: { [key]: value } });
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async update(
    unqRef: RequestAffiliateUnqRef,
    updateEntity: RequestAffiliateUpdateEntity,
  ): Promise<RequestAffiliateEntity> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const recAffiliate = await this.reqAffiliateRepo.findOne({
        where: { [key]: value },
      });

      const updateRecAffiliateEntity = Object.assign(
        recAffiliate,
        updateEntity,
      );

      return this.reqAffiliateRepo.save(updateRecAffiliateEntity);
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async delete(unqRef: RequestAffiliateUnqRef): Promise<void> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      await this.reqAffiliateRepo.delete({ [key]: value });
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async softDelete(
    unqRef: RequestAffiliateUnqRef,
  ): Promise<'success' | 'fail'> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const recAffiliate = await this.reqAffiliateRepo.findOne({
        where: { [key]: value },
      });

      if (recAffiliate.deletedAt) {
        return 'success';
      }

      const updateRecAffiliateEntity = Object.assign(recAffiliate, {
        deletedAt: new Date(),
      } as RequestAffiliateEntity);

      await this.reqAffiliateRepo.save(updateRecAffiliateEntity);

      return 'success';
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getAll(): Promise<RequestAffiliateEntity[]> {
    try {
      return await this.reqAffiliateRepo.find();
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getWithPaginationAndFilters(
    paginationDto: GenericPaginationDto,
  ): Promise<PaginationResult<RequestAffiliateEntity[]>> {
    try {
      const queryBuilder = this.reqAffiliateRepo.createQueryBuilder(
        TABLE.affiliate_queue,
      );

      return this.searchBuilder.search(
        paginationDto,
        TABLE.affiliate_queue,
        queryBuilder,
        { createdField: 'createdAt', searchField: 'name' },
      );
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }
}
