import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { KEY_INJECTION, KEY_OF_JOB, KEY_OF_QUEUE } from 'src/@metadata/keys';
import { PaypalWebHookService } from '../../Payment/Paypal/Paypal.webhook.service';
import { NodemailerService } from '../../Mail/Nodemailer/Nodemailer.service';
import { IOrderRepositoryContract } from '../../Repositories/OrderRepository/IOrderRepository.contract';
import { Inject, NotFoundException } from '@nestjs/common';
import { IUserRepositoryContract } from '../../Repositories/UserRepository/IUserRepository.contract';

@Processor(KEY_OF_QUEUE.PAYMENT)
export class JobConsumerService extends WorkerHost {
  constructor(
    private readonly paypalWebHookService: PaypalWebHookService,
    private readonly mailService: NodemailerService,
    @Inject(KEY_INJECTION.ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepositoryContract,
    @Inject(KEY_INJECTION.USER_REPOSITORY_CONTRACT)
    private readonly userRepository: IUserRepositoryContract,
  ) {
    super();
  }

  async process(job: Job, token?: string): Promise<any> {
    const data = job.data;

    if (job.name === KEY_OF_JOB.CONFIRM_PAYMENT) {
      await this.confirmPayment(data);
    }
  }

  private async confirmPayment(data: { body: any; headers: any }) {
    const { body, headers } = data;
    await this.paypalWebHookService.webhookResult(body, headers);

    const orderId = body.resource.purchase_units[0].invoice_id;

    const order = await this.orderRepository.getBy({ id: orderId });

    if (!order) {
      throw new NotFoundException('order not found, order id: ', order.id);
    }

    const user = await this.userRepository.getBy({ id: order.id });

    // ATUALIZAR O STATUS DA ORDEM PARA PAGO

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
