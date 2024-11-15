import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSoftDelete1731690847551 implements MigrationInterface {
  name = 'CreateSoftDelete1731690847551';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" RENAME COLUMN "isDeleted" TO "softDeleted"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" RENAME COLUMN "softDeleted" TO "isDeleted"`,
    );
  }
}
