import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { KEY_OF_JOB, KEY_OF_QUEUE } from 'src/@metadata/keys';
import { PaypalWebHookService } from '../../Payment/Paypal/Paypal.webhook.service';

@Processor(KEY_OF_QUEUE.PAYMENT)
export class JobConsumerService extends WorkerHost {
  constructor(private readonly paypalWebHookService: PaypalWebHookService) {
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
  }
}
