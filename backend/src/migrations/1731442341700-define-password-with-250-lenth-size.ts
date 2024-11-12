import { MigrationInterface, QueryRunner } from 'typeorm';

export class DefinePasswordWith250LenthSize1731442341700
  implements MigrationInterface
{
  name = 'DefinePasswordWith250LenthSize1731442341700';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "password" character varying(250) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "password" character varying(50) NOT NULL`,
    );
  }
}
