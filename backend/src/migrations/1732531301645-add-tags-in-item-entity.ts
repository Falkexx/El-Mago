import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTagsInItemEntity1732531301645 implements MigrationInterface {
  name = 'AddTagsInItemEntity1732531301645';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "item" ADD "tags" character varying array NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "tags"`);
  }
}
