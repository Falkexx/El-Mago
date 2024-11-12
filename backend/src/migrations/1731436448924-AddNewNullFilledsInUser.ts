import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNewNullFilledsInUser1731436448924
  implements MigrationInterface
{
  name = 'AddNewNullFilledsInUser1731436448924';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "cpfCnpj" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "country" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "discordUserName" DROP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "age"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "age" integer(150)`);
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT '"2024-11-12T18:34:10.390Z"'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT '"2024-11-12T18:34:10.390Z"'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "updatedAt" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "createdAt" DROP DEFAULT`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "age"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "age" numeric(150,0) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "discordUserName" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "country" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "cpfCnpj" SET NOT NULL`,
    );
  }
}
