import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueFieldsInAffiliate1731845939149
  implements MigrationInterface
{
  name = 'AddUniqueFieldsInAffiliate1731845939149';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "affiliate" DROP COLUMN "idSoftDelete"`,
    );
    await queryRunner.query(
      `ALTER TABLE "affiliate" ADD "shortId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "affiliate" ADD CONSTRAINT "UQ_420d22ca6da6b052ac696757634" UNIQUE ("shortId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "affiliate" ADD "numberPhone" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "affiliate" ADD CONSTRAINT "UQ_55f1ab49e4a921f0f6253bb9a9b" UNIQUE ("numberPhone")`,
    );
    await queryRunner.query(
      `ALTER TABLE "affiliate" ADD "cpfCnpj" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "affiliate" ADD CONSTRAINT "UQ_99a6c651635f38327ccf5eeb539" UNIQUE ("cpfCnpj")`,
    );
    await queryRunner.query(
      `ALTER TABLE "affiliate" ADD "gameNickName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "affiliate" ADD CONSTRAINT "UQ_bc1a3c3a06cb8014064071b2599" UNIQUE ("gameNickName")`,
    );
    await queryRunner.query(
      `ALTER TABLE "affiliate" ADD "photo" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "affiliate" ADD "isSoftDelete" boolean NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "affiliate" DROP COLUMN "isSoftDelete"`,
    );
    await queryRunner.query(`ALTER TABLE "affiliate" DROP COLUMN "photo"`);
    await queryRunner.query(
      `ALTER TABLE "affiliate" DROP CONSTRAINT "UQ_bc1a3c3a06cb8014064071b2599"`,
    );
    await queryRunner.query(
      `ALTER TABLE "affiliate" DROP COLUMN "gameNickName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "affiliate" DROP CONSTRAINT "UQ_99a6c651635f38327ccf5eeb539"`,
    );
    await queryRunner.query(`ALTER TABLE "affiliate" DROP COLUMN "cpfCnpj"`);
    await queryRunner.query(
      `ALTER TABLE "affiliate" DROP CONSTRAINT "UQ_55f1ab49e4a921f0f6253bb9a9b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "affiliate" DROP COLUMN "numberPhone"`,
    );
    await queryRunner.query(
      `ALTER TABLE "affiliate" DROP CONSTRAINT "UQ_420d22ca6da6b052ac696757634"`,
    );
    await queryRunner.query(`ALTER TABLE "affiliate" DROP COLUMN "shortId"`);
    await queryRunner.query(
      `ALTER TABLE "affiliate" ADD "idSoftDelete" boolean NOT NULL`,
    );
  }
}
