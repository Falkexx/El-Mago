import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixPriceType1735766849639 implements MigrationInterface {
  name = 'FixPriceType1735766849639';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "item" ALTER COLUMN "price" TYPE numeric(10,2)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "item" ALTER COLUMN "price" TYPE numeric(5,0)`,
    );
  }
}
