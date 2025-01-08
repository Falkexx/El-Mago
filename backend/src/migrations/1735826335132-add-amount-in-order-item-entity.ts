import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAmountInOrderItemEntity1735826335132
  implements MigrationInterface
{
  name = 'AddAmountInOrderItemEntity1735826335132';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD "quantity" integer NOT NULL DEFAULT '1'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "order_item" DROP COLUMN "quantity"`);
  }
}
