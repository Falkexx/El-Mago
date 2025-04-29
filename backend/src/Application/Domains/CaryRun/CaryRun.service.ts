import { PayloadType } from '#types';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { KEY_INJECTION } from 'src/@metadata/keys';
import { IUserRepositoryContract } from 'src/Application/Infra/Repositories/UserRepository/IUserRepository.contract';
import { DataSource } from 'typeorm';
import { CreateCaryRunDto } from './Dtos/CreateCaryRun.dtos';
import { IAffiliateRepositoryContract } from 'src/Application/Infra/Repositories/AffiliateRepository/IAffiliate.repository-contract';
import { ICaryRunRepositoryContract } from 'src/Application/Infra/Repositories/CaryRunRepository/ICaryRunRepository.contract';
import { generateShortId } from '#utils';
import { CreateCaryRunCategoryDto } from './Dtos/CreateCaryRunCatetory.dto';
import { GenericPaginationDto } from 'src/utils/validators';

@Injectable()
export class CaryRunService {
  constructor(
    @Inject(KEY_INJECTION.USER_REPOSITORY_CONTRACT)
    private readonly userRepository: IUserRepositoryContract,
    @Inject(KEY_INJECTION.AFFILIATE_REPOSITORY_CONTRACT)
    private readonly affiliateRepository: IAffiliateRepositoryContract,
    @Inject(KEY_INJECTION.CARY_RUN_REPOSITORY)
    private readonly caryRunRepository: ICaryRunRepositoryContract,

    private readonly dataSource: DataSource,
  ) {}

  async create(payload: PayloadType, caryRunDto: CreateCaryRunDto) {
    const trx = this.dataSource.createQueryRunner();

    try {
      await trx.startTransaction();

      const user = await this.userRepository.getBy({ id: payload.sub }, trx);

      if (!user) {
        throw new UnauthorizedException();
      }

      const affiliate = await this.affiliateRepository.getBy(
        {
          email: user.email,
        },
        trx,
      );

      if (!affiliate || affiliate.deletedAt) {
        throw new ForbiddenException('affiliate not exist or was deleted');
      }

      // check if category exist

      let category = await this.caryRunRepository.getCategoryBy(
        {
          id: caryRunDto.categoryId,
        },
        trx,
      );

      if (!category) {
        if (!caryRunDto.CategoryDto) {
          throw new BadRequestException(
            'require categoryId or pass CategoryDto object',
          );
        }

        category = await this.createCategory(caryRunDto.CategoryDto);
      }

      const caryRunCreated = await this.caryRunRepository.create(
        {
          id: generateShortId(12),
          amount: caryRunDto.amount,
          createdAt: new Date(),
          deletedAt: null,
          image: caryRunDto.image,
          name: caryRunDto.name,
          price: caryRunDto.price,
          description: caryRunDto.description ?? null,
          updatedAt: new Date(),
          Category: category,
          categoryId: category.id,
        },
        trx,
      );

      await trx.commitTransaction();

      return caryRunCreated;
    } catch (e) {
      await trx.rollbackTransaction();
      throw e;
    } finally {
      await trx.release();
    }
  }

  async getMany(paginationDto: GenericPaginationDto) {
    const trx = this.dataSource.createQueryRunner();

    try {
      await trx.startTransaction();

      const result = await this.caryRunRepository.getWithPaginationAndFilters(
        paginationDto,
        trx,
      );

      await trx.commitTransaction();

      return result;
    } catch (e) {
      console.error(e);
      await trx.rollbackTransaction();
      throw e;
    } finally {
      await trx.release();
    }
  }

  async createCategory(categoryDto: CreateCaryRunCategoryDto) {
    const trx = this.dataSource.createQueryRunner();

    try {
      await trx.connect();
      await trx.startTransaction();

      const categoryExist = await this.caryRunRepository.getCategoryBy(
        {
          name: categoryDto.name,
        },
        trx,
      );

      if (categoryExist) {
        throw new ConflictException('category already exist');
      }

      const categoryCreated = await this.caryRunRepository.createCategory(
        {
          id: generateShortId(12),
          name: categoryDto.name,
          description: categoryDto.description ?? null,
          image: categoryDto.image ?? null,
          deletedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        trx,
      );

      await trx.commitTransaction();

      return categoryCreated;
    } catch (e) {
      await trx.rollbackTransaction();
      throw e;
    } finally {
      await trx.release();
    }
  }

  async getManyCategories(paginationDto: GenericPaginationDto) {
    const trx = this.dataSource.createQueryRunner();

    try {
      await trx.startTransaction();

      const result = await this.caryRunRepository.getManyCategories(
        paginationDto,
        trx,
      );

      await trx.commitTransaction();

      return result;
    } catch (e) {
      console.error(e);
      await trx.rollbackTransaction();
      throw e;
    } finally {
      await trx.release();
    }
  }
}
