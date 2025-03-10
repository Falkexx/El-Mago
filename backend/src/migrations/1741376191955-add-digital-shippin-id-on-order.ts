import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDigitalShippinIdOnOrder1741376191955
  implements MigrationInterface
{
  name = 'AddDigitalShippinIdOnOrder1741376191955';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_b921bf06270fbe85e8c3753f4c1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" RENAME COLUMN "affiliateId" TO "digitalShippingId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP COLUMN "digitalShippingId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD "digitalShippingId" character varying(40) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "UQ_5a4fe092b21638cf168780cc039" UNIQUE ("digitalShippingId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_5a4fe092b21638cf168780cc039" FOREIGN KEY ("digitalShippingId") REFERENCES "digital_shipping"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_5a4fe092b21638cf168780cc039"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "UQ_5a4fe092b21638cf168780cc039"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP COLUMN "digitalShippingId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD "digitalShippingId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" RENAME COLUMN "digitalShippingId" TO "affiliateId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_b921bf06270fbe85e8c3753f4c1" FOREIGN KEY ("affiliateId") REFERENCES "affiliate"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
