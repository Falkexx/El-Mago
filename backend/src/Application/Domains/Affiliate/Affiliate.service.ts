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
      battleTag: '',
      phoneNumber: affiliateDto.phoneNumber,
      cpfCnpj: affiliateDto.cpfCnpj,
      characterName: affiliateDto.characterName,
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
    const conficts =
      await this.affiliateRepository.findConflictingFields(affiliateDto);

    if (Object.keys(conficts).length > 0) {
      throw new ConflictException({
        data: conficts,
        message: 'Have conflict fields',
      });
    }
  }

  async findWithPaginationAndFilters(paginationDto: GenericPaginationDto) {
    return this.affiliateRepository.getWithPaginationAndFilters(paginationDto);
  }
}
