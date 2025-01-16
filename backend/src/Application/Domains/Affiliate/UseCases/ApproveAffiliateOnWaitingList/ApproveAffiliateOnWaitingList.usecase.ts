import {
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { IRequestAffiliateRepositoryContract } from 'src/Application/Infra/Repositories/RequestAffiliate/IRequestAffiliate.repository-contract';
import { ApproveAffiliateOnWaitingListDto } from './ApproveAffiliateOnWaitingList.dto';
import { IUserRepositoryContract } from 'src/Application/Infra/Repositories/UserRepository/IUserRepository.contract';
import {
  RequestAffiliateEntity,
  RequestAffiliateUpdateEntity,
} from 'src/Application/Entities/Request-Affiliate.entity';
import { KEY_INJECTION } from 'src/@metadata/keys';
import { AffiliateEntity } from 'src/Application/Entities/Affiliate.entity';
import { env, shortId, uuidV4 } from '#utils';
import { IAffiliateRepositoryContract } from 'src/Application/Infra/Repositories/AffiliateRepository/IAffiliate.repository-contract';
import { NodemailerService } from 'src/Application/Infra/Mail/Nodemailer/Nodemailer.service';

export type ApproveAffiliateOnWaitingListUseCaseResult = {
  affiliate: Omit<AffiliateEntity, 'user'>;
  affiliateOnHold: RequestAffiliateEntity;
};

@Injectable()
export class ApproveAffiliateOnWaitingListUseCase {
  constructor(
    @Inject(KEY_INJECTION.USER_REPOSITORY_CONTRACT)
    private readonly userRepository: IUserRepositoryContract,
    @Inject(KEY_INJECTION.REQUEST_AFFILIATE_REPOSITORY)
    private readonly reqAffiliateRepository: IRequestAffiliateRepositoryContract,
    @Inject(KEY_INJECTION.AFFILIATE_REPOSITORY_CONTRACT)
    private readonly affiliateRepository: IAffiliateRepositoryContract,
    private readonly mailService: NodemailerService,
  ) {}

  async execute(
    appAffiliateDto: ApproveAffiliateOnWaitingListDto,
  ): Promise<ApproveAffiliateOnWaitingListUseCaseResult> {
    const user = await this.userRepository.getBy({
      email: appAffiliateDto.email,
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const affiliateOnHold = await this.reqAffiliateRepository.getBy({
      email: appAffiliateDto.email,
    });

    if (!affiliateOnHold) {
      throw new NotAcceptableException('affiliate is not on the waiting list');
    }

    if (affiliateOnHold.status === 'APPROVED') {
      throw new NotAcceptableException('affiliate already approved');
    }

    // create affiliate
    const affiliateEntity = Object.assign(new AffiliateEntity(), {
      id: uuidV4(),
      shortId: shortId(),
      name: affiliateOnHold.name,
      email: user.email,
      battleTag: '',
      phoneNumber: affiliateOnHold.phoneNumber,
      cpfCnpj: affiliateOnHold.cpf,
      characterName: affiliateOnHold.characterName,
      photo: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      isSoftDelete: false,
      user: user,
    } as AffiliateEntity);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { user: _, ...affiliateCreated } =
      await this.affiliateRepository.create(affiliateEntity);

    // update affiliate on hold

    const affiliateOnHoldEntity = Object.assign(
      new RequestAffiliateUpdateEntity(),
      {
        status: 'APPROVED',
      } as RequestAffiliateUpdateEntity,
    );

    /**
     * Implement send mail service
     */

    this.mailService.send({
      emails: [user.email],
      htmlContent: ``,
      name: user.firstName,
      subject: 'Requisição para ser um afiliado',
      text: 'Parabéns você foi aprovado para ser um afiliado',
    });

    this.mailService.send({
      emails: [env.ADMIN_EMAIL],
      htmlContent: ``,
      name: user.firstName,
      subject: 'Aprovação de afiliado',
      text: `O usuário ${affiliateOnHold.name} foi aprovado para ser um afiliado`,
    });

    return {
      affiliate: affiliateCreated,
      affiliateOnHold: await this.reqAffiliateRepository.update(
        { id: affiliateOnHold.id },
        affiliateOnHoldEntity,
      ),
    };
  }
}
