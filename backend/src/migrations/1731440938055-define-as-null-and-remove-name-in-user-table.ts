import { MigrationInterface, QueryRunner } from 'typeorm';

export class DefineAsNullAndRemoveNameInUserTable1731440938055
  implements MigrationInterface
{
  name = 'DefineAsNullAndRemoveNameInUserTable1731440938055';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "numberPhone" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "numberPhone" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "name" character varying(40) NOT NULL`,
    );
  }
}
