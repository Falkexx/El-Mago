import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChagePriceFieldType1735766237741 implements MigrationInterface {
  name = 'ChagePriceFieldType1735766237741';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_status" ADD "status" character varying(50) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "order_item" DROP COLUMN "price"`);
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD "price" numeric(10,2) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "order_item" DROP COLUMN "price"`);
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD "price" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "order_status" DROP COLUMN "status"`);
  }
}
