import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRelationBetweenAffiliateAndOrder1737404188937
  implements MigrationInterface
{
  name = 'AddRelationBetweenAffiliateAndOrder1737404188937';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" ADD "affiliateId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_b921bf06270fbe85e8c3753f4c1" FOREIGN KEY ("affiliateId") REFERENCES "affiliate"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_b921bf06270fbe85e8c3753f4c1"`,
    );
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "affiliateId"`);
  }
}
