import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { KEY_OF_JOB, KEY_OF_QUEUE } from 'src/@metadata/keys';

export interface MakeDepositProps {
  orderId: string;
}

export class TransactionProducer {
  constructor(
    @InjectQueue(KEY_OF_QUEUE.TRANSACTION) private readonly queue: Queue,
  ) {}

  async makeDeposit(data: MakeDepositProps) {
    // const delay = 1 * 60 * 1000; // 1 min in milliseconds
    const delay = 3 * 1000; // TODO: remove in the production.

    await this.queue.add(KEY_OF_JOB.MAKE_DEPOSIT, data, {
      delay,
    });
  }
}
