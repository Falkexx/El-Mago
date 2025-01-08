import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePaymentUrlInOrder1735905458239
  implements MigrationInterface
{
  name = 'CreatePaymentUrlInOrder1735905458239';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" ADD "paymentUrl" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "paymentUrl"`);
  }
}
