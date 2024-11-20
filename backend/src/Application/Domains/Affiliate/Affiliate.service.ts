import {
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { KEY_INJECTION } from 'src/@metadata/keys';
import { IAffiliateRepositoryContract } from 'src/Application/Infra/Repositories/AffiliateRepository/IAffiliate.repository-contract';
import { CreateAffiliateDto } from './dtos';
import { AffiliateEntity } from 'src/Application/Entities/Affiliate.entity';
import { shortId, uuidV4 } from '#utils';
import { IUserRepositoryContract } from 'src/Application/Infra/Repositories/UserRepository/IUserRepository.contract';
import { GenericPaginationDto } from 'src/utils/validators';

@Injectable()
export class AffiliateService {
  constructor(
    @Inject(KEY_INJECTION.AFFILIATE_REPOSITORY_CONTRACT)
    private readonly affiliateRepository: IAffiliateRepositoryContract,

    @Inject(KEY_INJECTION.USER_REPOSITORY_CONTRACT)
    private readonly userRepository: IUserRepositoryContract,
  ) {}

  async create(affiliateDto: CreateAffiliateDto) {
    await this.checkIfAffiliateExistOnThrow(affiliateDto);

    const user = await this.userRepository.getBy({ email: affiliateDto.email });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const affiliateEntity = Object.assign(new AffiliateEntity(), {
      id: uuidV4(),
      shortId: shortId(),
      name: affiliateDto.name,
      email: affiliateDto.email,
      username: affiliateDto.username,
      numberPhone: affiliateDto.numberPhone,
      cpfCnpj: affiliateDto.cpfCnpj,
      gameNickName: affiliateDto.gameNickName,
      photo: affiliateDto.photo ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
      isSoftDelete: false,
      user: user,
    } as AffiliateEntity);

    const affiliateCreated =
      await this.affiliateRepository.create(affiliateEntity);

    return affiliateCreated;
  }

  async getById(id: string) {
    const affiliate = await this.affiliateRepository.getBy({ id });

    return affiliate;
  }

  private async checkIfAffiliateExistOnThrow(affiliateDto: CreateAffiliateDto) {
    const affiliateEmail = await this.affiliateRepository.getBy({
      email: affiliateDto.email,
    });

    if (affiliateEmail) {
      throw new NotAcceptableException('affiliate already exist with email');
    }

    const affiliateByUserName = await this.affiliateRepository.getBy({
      username: affiliateDto.username,
    });

    if (affiliateByUserName) {
      throw new NotAcceptableException('affiliate already exist with username');
    }

    const affiliateByNumberPhone = await this.affiliateRepository.getBy({
      numberPhone: affiliateDto.numberPhone,
    });

    if (affiliateByNumberPhone) {
      throw new NotAcceptableException(
        'affiliate already exist with number phone',
      );
    }

    const affiliateByCpfCnpj = await this.affiliateRepository.getBy({
      cpfCnpj: affiliateDto.cpfCnpj,
    });

    if (affiliateByCpfCnpj) {
      throw new NotAcceptableException('affiliate already exist with cpf cnpj');
    }

    const affiliateByGameNickName = await this.affiliateRepository.getBy({
      gameNickName: affiliateDto.gameNickName,
    });

    if (affiliateByGameNickName) {
      throw new NotAcceptableException(
        'affiliate already exist with game nick name',
      );
    }
  }

  async findWithPaginationAndFilters(paginationDto: GenericPaginationDto) {
    return this.affiliateRepository.getWithPaginationAndFilters(paginationDto);
  }
}
