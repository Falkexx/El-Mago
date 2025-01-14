import {
  Inject,
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { KEY_INJECTION } from 'src/@metadata/keys';
import { IAffiliateRepositoryContract } from 'src/Application/Infra/Repositories/AffiliateRepository/IAffiliate.repository-contract';
import { IRequestAffiliateRepositoryContract } from 'src/Application/Infra/Repositories/RequestAffiliate/IRequestAffiliate.repository-contract';
import { ReqAffiliateDto } from './ReqAffiliate.dto';
import { PayloadType } from '#types';
import { IUserRepositoryContract } from 'src/Application/Infra/Repositories/UserRepository/IUserRepository.contract';
import { RequestAffiliateEntity } from 'src/Application/Entities/Request-Affiliate.entity';
import { uuidV4 } from '#utils';

@Injectable()
export class ReqAffiliateUseCase {
  constructor(
    @Inject(KEY_INJECTION.USER_REPOSITORY_CONTRACT)
    private readonly userRepository: IUserRepositoryContract,
    @Inject(KEY_INJECTION.AFFILIATE_REPOSITORY_CONTRACT)
    private readonly affiliateRepository: IAffiliateRepositoryContract,
    @Inject(KEY_INJECTION.REQUEST_AFFILIATE_REPOSITORY)
    private readonly requestAffiliateRepository: IRequestAffiliateRepositoryContract,
  ) {}

  async execute(payload: PayloadType, reqAffiliateDto: ReqAffiliateDto) {
    const user = await this.userRepository.getBy({ id: payload.sub });

    if (!user) {
      throw new UnauthorizedException();
    }

    const affiliate = await this.affiliateRepository.getBy({
      email: user.email,
    });

    if (affiliate) {
      throw new NotAcceptableException('already affiliate');
    }

    const alreadyReqAffiliate = await this.requestAffiliateRepository.getBy({
      email: user.email,
    });

    if (alreadyReqAffiliate) {
      throw new NotAcceptableException('you are already on the waiting list');
    }

    const reqAffiliateEntity = Object.assign(new RequestAffiliateEntity(), {
      id: uuidV4(),
      name: reqAffiliateDto.name,
      discord: reqAffiliateDto.discord,
      battleTag: reqAffiliateDto.battleTag,
      characterName: reqAffiliateDto.characterName,
      phoneNumber: reqAffiliateDto.phoneNumber,
      cpf: reqAffiliateDto.cpf,
      country: 'BRAZIL',
      createdAt: new Date(),
      deletedAt: null,
      email: user.email,
      status: 'PENDING',
      userId: user.id,
      User: user,
    } as RequestAffiliateEntity);

    const affiliateCreated =
      await this.requestAffiliateRepository.create(reqAffiliateEntity);

    return affiliateCreated;
  }
}
