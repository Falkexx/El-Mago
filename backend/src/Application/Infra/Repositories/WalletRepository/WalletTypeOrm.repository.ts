import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  WalletEntity,
  WalletUniqueRefs,
  WalletUpdateEntity,
} from 'src/Application/Entities/Wallet.entity';
import { GenericPaginationDto } from 'src/utils/validators';
import { splitKeyAndValue } from '#utils';
import { QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TABLE } from 'src/@metadata/tables';
import { IWalletRepositoryContract } from './IWallet.repository-contract';
import { SearchBuilderService } from '../SearchBuilder.service';
import { SearchBuilderResult } from '#types';

@Injectable()
export class WalletTypeOrmRepository implements IWalletRepositoryContract {
  constructor(
    @InjectRepository(WalletEntity)
    private readonly walletRepository: Repository<WalletEntity>,
    private readonly searchBuilderService: SearchBuilderService,
  ) {}

  async create(entity: WalletEntity, trx: QueryRunner): Promise<WalletEntity> {
    try {
      const result = (
        await trx.manager
          .createQueryBuilder()
          .insert()
          .into(WalletEntity)
          .values(entity)
          .returning('*')
          .execute()
      ).raw[0];

      return result;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getBy(
    unqRef: WalletUniqueRefs,
    trx: QueryRunner,
  ): Promise<WalletEntity> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const wallet = await trx.manager
        .createQueryBuilder()
        .select(TABLE.wallet)
        .from(WalletEntity, TABLE.wallet)
        .where(`"${TABLE.wallet}"."${key}" = :value`, { value })
        .getOne();

      return wallet;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async update(
    unqRef: WalletUniqueRefs,
    updateEntity: WalletUpdateEntity,
    trx?: QueryRunner,
  ): Promise<WalletEntity> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const wallet = (
        await trx.manager
          .createQueryBuilder()
          .update(WalletEntity)
          .set(updateEntity)
          .where(`"${TABLE.wallet}"."${key}" = :value`, { value })
          .andWhere(`"${TABLE.wallet}"."deletedAt" IS NULL`)
          .returning('*')
          .execute()
      ).raw[0];

      return wallet;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async delete(unqRef: WalletUniqueRefs, trx: QueryRunner): Promise<void> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      await trx.manager
        .createQueryBuilder()
        .delete()
        .from(WalletEntity)
        .where(`"${TABLE.wallet}"."${key}" = :value`, { value })
        .execute();
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async softDelete(
    unqRef: WalletUniqueRefs,
    trx: QueryRunner,
  ): Promise<WalletEntity> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const result = (
        await trx.manager
          .createQueryBuilder()
          .update(WalletEntity)
          .set({ deletedAt: new Date() })
          .where(`"${TABLE.wallet}"."${key}" = :value`, { value })
          .andWhere(`"${TABLE.wallet}"."deletedAt" IS NULL`)
          .returning('*')
          .execute()
      ).raw[0];

      return result;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getAll(trx?: QueryRunner): Promise<WalletEntity[]> {
    try {
      return await trx.manager
        .createQueryBuilder()
        .select('*')
        .from(WalletEntity, TABLE.wallet)
        .where(`"${TABLE.wallet}"."deletedAt" IS NULL`)
        .getMany();
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getWithPaginationAndFilters(
    paginationDto: GenericPaginationDto,
    trx: QueryRunner,
  ): Promise<SearchBuilderResult<WalletEntity>> {
    try {
      const queryBuilder = trx.manager.createQueryBuilder();

      const result = await this.searchBuilderService.search(
        paginationDto,
        WalletEntity,
        TABLE.wallet,
        queryBuilder,
      );

      return result;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getWalletByAffiliateId(affiliateId: string): Promise<WalletEntity> {
    try {
      const wallet = await this.walletRepository
        .createQueryBuilder()
        .andWhere(`"${TABLE.wallet}"."affiliateId" = :affiliateId`, {
          affiliateId,
        })
        .getOne();
      return wallet;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }
}
