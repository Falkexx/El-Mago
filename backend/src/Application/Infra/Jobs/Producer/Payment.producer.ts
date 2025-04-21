import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { KEY_OF_JOB, KEY_OF_QUEUE } from 'src/@metadata/keys';
import { ConfirmPaymentProps } from 'src/@types/job';

@Injectable()
export class JobProducerService {
  constructor(
    @InjectQueue(KEY_OF_QUEUE.PAYMENT) private readonly queue: Queue,
  ) {}

  async confirmPayment(data: ConfirmPaymentProps) {
    await this.queue.add(KEY_OF_JOB.CONFIRM_PAYMENT, data);
  }
}
