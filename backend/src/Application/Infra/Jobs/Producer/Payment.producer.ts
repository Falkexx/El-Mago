import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { KEY_OF_JOB, KEY_OF_QUEUE } from 'src/@metadata/keys';

@Injectable()
export class JobProducerService {
  constructor(
    @InjectQueue(KEY_OF_QUEUE.PAYMENT) private readonly queue: Queue,
  ) {}

  // async signUpSendMail() {
  //   await this.queue.add(KEY_OF_JOB, Ddata);
  // }

  // async transactionSendMail() {
  //   await this.queue.add();
  // }

  async confirmPayment(data: { body: any; headers: any }) {
    // await this.queue.add(KEY_OF_JOB.CONFIRM_PAYMENT, data);
    console.log('producer called');
    await this.queue.add(KEY_OF_JOB.CONFIRM_PAYMENT, data);
  }
}
