import {
  ConflictException,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { KEY_INJECTION } from 'src/@metadata/keys';
import { IAffiliateRepositoryContract } from 'src/Application/Infra/Repositories/AffiliateRepository/IAffiliate.repository-contract';
import { CreateAffiliateDto } from './dtos';
import {
  AffiliateEntity,
  AffiliateEntityUniqueRefs,
} from 'src/Application/Entities/Affiliate.entity';
import { generateShortId, shortId, uuidV4 } from '#utils';
import { IUserRepositoryContract } from 'src/Application/Infra/Repositories/UserRepository/IUserRepository.contract';
import { GenericPaginationDto } from 'src/utils/validators';
import { ROLE } from 'src/@metadata/roles';
import { DataSource } from 'typeorm';
import { IWalletRepositoryContract } from 'src/Application/Infra/Repositories/WalletRepository/IWallet.repository-contract';

@Injectable()
export class AffiliateService {
  constructor(
    @Inject(KEY_INJECTION.AFFILIATE_REPOSITORY_CONTRACT)
    private readonly affiliateRepository: IAffiliateRepositoryContract,

    @Inject(KEY_INJECTION.USER_REPOSITORY_CONTRACT)
    private readonly userRepository: IUserRepositoryContract,

    @Inject(KEY_INJECTION.WALLET_REPOSITORY)
    private readonly accountRepository: IWalletRepositoryContract,

    private readonly dataSource: DataSource,
  ) {}

  async create(affiliateDto: CreateAffiliateDto) {
    const trx = this.dataSource.createQueryRunner();

    try {
      await trx.startTransaction();

      const affiliateExist = await this.affiliateRepository.getBy(
        {
          email: affiliateDto.email,
        },
        trx,
      );

      if (affiliateExist) {
        throw new NotAcceptableException('affiliate already exist');
      }

      await this.checkIfAffiliateExistOnThrow(affiliateDto);

      const user = await this.userRepository.getBy(
        {
          email: affiliateDto.email,
        },
        trx,
      );

      if (!user) {
        throw new NotFoundException('user not found');
      }

      const affiliateCreated = await this.affiliateRepository.create(
        {
          id: uuidV4(),
          shortId: shortId(),
          name: affiliateDto.name,
          email: affiliateDto.email,
          battleTag: affiliateDto.battleTag,
          discord: affiliateDto.discord,
          phoneNumber: affiliateDto.phoneNumber,
          cpfCnpj: affiliateDto.cpfCnpj,
          characterName: affiliateDto.characterName,
          photo: affiliateDto.photo ?? null,
          createdAt: new Date(),
          updatedAt: new Date(),
          fluentLanguages: affiliateDto.fluentLanguages,
          user: user,
          deletedAt: null,
          Account: null,
        } as AffiliateEntity,
        trx,
      );

      const accountCreated = await this.accountRepository.create(
        {
          id: generateShortId(20),
          Affiliate: affiliateCreated,
          affiliateId: affiliateCreated.id,
          balance: String(0.0),
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          Transactions: [],
        },
        trx,
      );

      const userUpdated = await this.userRepository.update(
        {
          id: user.id,
        },
        {
          roles: [...user.roles, ROLE.AFFILIATE],
          affiliateId: affiliateCreated.id,
        },
        trx,
      );

      await trx.commitTransaction();

      return {
        affiliate: affiliateCreated,
        account: accountCreated,
        user: userUpdated,
      };
    } catch (e) {
      await trx.rollbackTransaction();
      throw e;
    } finally {
      await trx.release();
    }
  }

  async getById(id: string) {
    const trx = this.dataSource.createQueryRunner();
    try {
      await trx.startTransaction();
      const affiliate = await this.affiliateRepository.getBy({ id }, trx);

      await trx.commitTransaction();
      return affiliate;
    } catch (e) {
      await trx.rollbackTransaction();
      throw e;
    } finally {
      await trx.release();
    }
  }

  private async checkIfAffiliateExistOnThrow(affiliateDto: CreateAffiliateDto) {
    const trx = this.dataSource.createQueryRunner();

    try {
      await trx.startTransaction();

      const conficts = await this.affiliateRepository.findConflictingFields(
        {
          id: undefined,
          characterName: affiliateDto.characterName,
          cpfCnpj: affiliateDto.cpfCnpj,
          email: affiliateDto.email,
          battleTag: affiliateDto.battleTag,
          phoneNumber: affiliateDto.phoneNumber,
        } as AffiliateEntityUniqueRefs,
        trx,
      );

      if (Object.keys(conficts).length > 0) {
        throw new ConflictException({
          conflicts: conficts,
          message: 'Have conflict fields',
        });
      }

      await trx.commitTransaction();
    } catch (e) {
      await trx.rollbackTransaction();
      throw e;
    } finally {
      await trx.release();
    }
  }

  async findWithPaginationAndFilters(paginationDto: GenericPaginationDto) {
    const trx = this.dataSource.createQueryRunner();

    try {
      await trx.startTransaction();

      const affiliates =
        await this.affiliateRepository.getWithPaginationAndFilters(
          paginationDto,
          trx,
        );

      await trx.commitTransaction();

      return affiliates;
    } catch (e) {
      await trx.rollbackTransaction();
      throw e;
    } finally {
      await trx.release();
    }
  }
}
