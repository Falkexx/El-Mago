import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDescriptionFieldAndCreateUpdateColumnInItemEntity1732401286523
  implements MigrationInterface
{
  name = 'AddDescriptionFieldAndCreateUpdateColumnInItemEntity1732401286523';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "item" ADD "description" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "description"`);
  }
}
