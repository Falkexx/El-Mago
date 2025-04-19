import {
  ForbiddenException,
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
import { env, uuidV4 } from '#utils';
import { NodemailerService } from 'src/Application/Infra/Mail/Nodemailer/Nodemailer.service';
import { DataSource } from 'typeorm';

@Injectable()
export class ReqAffiliateUseCase {
  constructor(
    @Inject(KEY_INJECTION.USER_REPOSITORY_CONTRACT)
    private readonly userRepository: IUserRepositoryContract,
    @Inject(KEY_INJECTION.AFFILIATE_REPOSITORY_CONTRACT)
    private readonly affiliateRepository: IAffiliateRepositoryContract,
    @Inject(KEY_INJECTION.REQUEST_AFFILIATE_REPOSITORY)
    private readonly requestAffiliateRepository: IRequestAffiliateRepositoryContract,
    private readonly mailService: NodemailerService,
    private readonly dataSource: DataSource,
  ) {}

  async execute(payload: PayloadType, reqAffiliateDto: ReqAffiliateDto) {
    const trx = this.dataSource.createQueryRunner();

    try {
      await trx.startTransaction();

      const user = await this.userRepository.getBy({ id: payload.sub }, trx);

      if (!user) {
        throw new UnauthorizedException();
      }

      if (user.isBanned || user.isDeleted) {
        throw new ForbiddenException('user deleted or banned');
      }

      const affiliate = await this.affiliateRepository.getBy(
        {
          email: user.email,
        },
        trx,
      );

      if (affiliate) {
        throw new NotAcceptableException('already affiliate');
      }

      const alreadyReqAffiliate = await this.requestAffiliateRepository.getBy(
        {
          email: user.email,
        },
        trx,
      );

      if (alreadyReqAffiliate) {
        throw new NotAcceptableException('you are already on the waiting list');
      }

      const affiliateCreated = await this.requestAffiliateRepository.create(
        {
          id: uuidV4(),
          name: reqAffiliateDto.name,
          discord: reqAffiliateDto.discord,
          battleTag: reqAffiliateDto.battleTag,
          characterName: reqAffiliateDto.characterName,
          phoneNumber: reqAffiliateDto.phoneNumber,
          cpf: reqAffiliateDto.cpf,
          fluentLanguages: reqAffiliateDto.fluentLanguages,
          country: 'BRAZIL',
          createdAt: new Date(),
          deletedAt: null,
          email: user.email,
          status: 'PENDING',
          userId: user.id,
          User: user,
        } as RequestAffiliateEntity,
        trx,
      );

      this.mailService.send({
        name: user.firstName,
        emails: [user.email],
        htmlContent: ``,
        subject: 'Request to be affiliate',
        text: 'Você solicitou ser um affiliado na plataforma El-Mago. Aguarde sua aprovação',
      });

      this.mailService.send({
        name: 'Admin from El-mago',
        emails: [env.ADMIN_EMAIL],
        htmlContent: ``,
        subject: 'Se tornar um afiliado',
        text: `O usuário ${user.firstName} com o email de ${user.email}, quer ser tornar um afiliado. Consulte a fila de espera para aprovar.`,
      });

      await trx.commitTransaction();

      return affiliateCreated;
    } catch (e) {
      await trx.rollbackTransaction();
      throw e;
    } finally {
      await trx.release();
    }
  }
}
