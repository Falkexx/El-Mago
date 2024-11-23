import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSoftDeleteInImageAndItemEntity1732395840206
  implements MigrationInterface
{
  name = 'AddSoftDeleteInImageAndItemEntity1732395840206';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "image" ADD "softDeleted" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ADD "softDeleted" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "softDeleted"`);
    await queryRunner.query(`ALTER TABLE "image" DROP COLUMN "softDeleted"`);
  }
}
