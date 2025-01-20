import { KEY_INJECTION } from 'src/@metadata/keys';
import { RefuseAffiliateOnWaitingListDto } from './RefuseAffiliateOnWaitingList.dto';
import { IUserRepositoryContract } from 'src/Application/Infra/Repositories/UserRepository/IUserRepository.contract';
import { IAffiliateRepositoryContract } from 'src/Application/Infra/Repositories/AffiliateRepository/IAffiliate.repository-contract';
import {
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { IRequestAffiliateRepositoryContract } from 'src/Application/Infra/Repositories/RequestAffiliate/IRequestAffiliate.repository-contract';
import { NodemailerService } from 'src/Application/Infra/Mail/Nodemailer/Nodemailer.service';
import { RequestAffiliateEntity } from 'src/Application/Entities/Request-Affiliate.entity';

@Injectable()
export class RefuseAffiliateOnWaitingListUseCase {
  constructor(
    @Inject(KEY_INJECTION.USER_REPOSITORY_CONTRACT)
    private readonly userRepository: IUserRepositoryContract,
    @Inject(KEY_INJECTION.AFFILIATE_REPOSITORY_CONTRACT)
    private readonly affiliateRepository: IAffiliateRepositoryContract,
    @Inject(KEY_INJECTION.REQUEST_AFFILIATE_REPOSITORY)
    private readonly requestAffiliateRepository: IRequestAffiliateRepositoryContract,
    private readonly mailService: NodemailerService,
  ) {}

  async execute({ email }: RefuseAffiliateOnWaitingListDto) {
    const user = await this.userRepository.getBy({ email });

    if (!user) {
      throw new UnauthorizedException();
    }

    const affiliate = await this.affiliateRepository.getBy({ email });

    const affiliateOnWaitingList = await this.requestAffiliateRepository.getBy({
      email,
    });

    if (!affiliateOnWaitingList) {
      throw new NotFoundException('affiliate in the queue was not found');
    }

    if (affiliateOnWaitingList.status === 'APPROVED' || affiliate) {
      throw new NotAcceptableException(
        'affiliate has already been approved, you can only ban him',
      );
    }

    // update affiliate on list has declined

    const affiliateOnWaitingListUpdateEntity = Object.assign(
      new RequestAffiliateEntity(),
      {
        status: 'DECLINED',
      } as RequestAffiliateEntity,
    );

    const affiliateOnWaitingListUpdated =
      await this.requestAffiliateRepository.update(
        {
          id: affiliateOnWaitingList.id,
        },
        affiliateOnWaitingListUpdateEntity,
      );

    this.mailService.send({
      emails: [user.email],
      htmlContent: ``,
      name: affiliateOnWaitingList.name,
      subject: 'Not possible to become affiliate',
      text: 'Unfortunately it was not possible to become an affiliate, perhaps it will be possible at another time',
    });

    return affiliateOnWaitingListUpdated;
  }
}
