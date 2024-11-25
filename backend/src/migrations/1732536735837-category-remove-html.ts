import { MigrationInterface, QueryRunner } from 'typeorm';

export class CategoryRemoveHtml1732536735837 implements MigrationInterface {
  name = 'CategoryRemoveHtml1732536735837';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "html"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "category" ADD "html" character varying(150)`,
    );
  }
}
