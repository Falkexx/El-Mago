import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { KEY_INJECTION, KEY_OF_JOB, KEY_OF_QUEUE } from 'src/@metadata/keys';
import { NodemailerService } from '../../Mail/Nodemailer/Nodemailer.service';
import { IOrderRepositoryContract } from '../../Repositories/OrderRepository/IOrderRepository.contract';
import {
  HttpException,
  HttpStatus,
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IUserRepositoryContract } from '../../Repositories/UserRepository/IUserRepository.contract';
import { env, generateShortId } from '#utils';
import { ConfirmPaymentProps } from 'src/@types/job';
import { HttpService } from '@nestjs/axios';
import { InfraCredentialsManagerService } from '../../InfraCredentialsManager/infraCredentialsManager.service';

@Processor(KEY_OF_QUEUE.PAYMENT)
export class JobConsumerService extends WorkerHost {
  constructor(
    private readonly mailService: NodemailerService,
    @Inject(KEY_INJECTION.ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepositoryContract,
    @Inject(KEY_INJECTION.USER_REPOSITORY_CONTRACT)
    private readonly userRepository: IUserRepositoryContract,
    private readonly httpService: HttpService,
    private readonly infraCredentialsManagerModule: InfraCredentialsManagerService,
  ) {
    super();
  }

  async process(job: Job, token?: string): Promise<any> {
    const data = job.data;

    if (job.name === KEY_OF_JOB.CONFIRM_PAYMENT) {
      await this.confirmPayment(data);
    }
  }

  private async confirmPayment(data: ConfirmPaymentProps) {
    await this.WebHookParser(data.body, data.headers);

    if (data.body.resource.status === 'APPROVED') {
      // CALL QUEUE TO PROCESS ORDER
      const orderId = data.body.resource.purchase_units[0].invoice_id;

      const order = await this.orderRepository.getBy({ id: orderId });

      if (!order) {
        throw new NotFoundException('order not found, order id: ', order.id);
      }

      const user = await this.userRepository.getBy({ id: order.userId });

      if (!user) {
        throw new NotFoundException('user not found');
      }

      // ATUALIZAR O STATUS DA ORDEM PARA PAGO
      await this.orderRepository.createOrderStatus({
        id: generateShortId(20),
        createdAt: new Date(),
        order: order,
        status: 'PAID',
        title: 'the order is paid',
      });

      // SEND EMAIL TO CUSTOMER
      await this.mailService.send({
        emails: [user.email],
        name: user.firstName,
        subject: `confirmação do pagamento`,
        text: `obrigado por tem comprado ${order.name}`,
        htmlContent: `
        <h1>confirmação do pagamento</h1>
        <h3>${user.firstName} ficamos agradecidos pela compra</h3>
        <p>${order.name}<p/>
        <span>id: ${order.id}</span>
        <span>total: R$ ${order.totalPrice}</span>
        <span>criado em: R$ ${order.createdAt}</span>
      `,
      });
    }
  }

  private async WebHookParser(body: any, headers: any) {
    const paypalAccessToken =
      await this.infraCredentialsManagerModule.getPaypalAccessToken();

    const verificationData = {
      auth_algo: headers['paypal-auth-algo'],
      cert_url: headers['paypal-cert-url'],
      transmission_sig: headers['paypal-transmission-sig'],
      transmission_id: headers['paypal-transmission-id'],
      transmission_time: headers['paypal-transmission-time'],
      webhook_id: env.WEB_HOOK_ID,
      webhook_event: body,
    };

    try {
      const response = await this.httpService.axiosRef.post(
        `${env.PAYPAL_BASE_URL}/v1/notifications/verify-webhook-signature`,
        verificationData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${paypalAccessToken}`,
          },
        },
      );

      if (response.data.verification_status !== 'SUCCESS') {
        throw new HttpException('Sgnature invalid', HttpStatus.FORBIDDEN);
      }
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
