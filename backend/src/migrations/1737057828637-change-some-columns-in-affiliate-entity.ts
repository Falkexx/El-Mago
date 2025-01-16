import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeSomeColumnsInAffiliateEntity1737057828637
  implements MigrationInterface
{
  name = 'ChangeSomeColumnsInAffiliateEntity1737057828637';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "affiliate" DROP CONSTRAINT "UQ_0d73a01532b95569f964c80c826"`,
    );
    await queryRunner.query(`ALTER TABLE "affiliate" DROP COLUMN "username"`);
    await queryRunner.query(
      `ALTER TABLE "affiliate" DROP CONSTRAINT "UQ_55f1ab49e4a921f0f6253bb9a9b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "affiliate" DROP COLUMN "numberPhone"`,
    );
    await queryRunner.query(
      `ALTER TABLE "affiliate" DROP CONSTRAINT "UQ_bc1a3c3a06cb8014064071b2599"`,
    );
    await queryRunner.query(
      `ALTER TABLE "affiliate" DROP COLUMN "gameNickName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "affiliate" ADD "battleTag" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "affiliate" ADD CONSTRAINT "UQ_f1142f9ed3c6b00d7315047048f" UNIQUE ("battleTag")`,
    );
    await queryRunner.query(
      `ALTER TABLE "affiliate" ADD "phoneNumber" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "affiliate" ADD CONSTRAINT "UQ_a9e2a42e6a59a705ddac083152b" UNIQUE ("phoneNumber")`,
    );
    await queryRunner.query(
      `ALTER TABLE "affiliate" ADD "characterName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "affiliate" ADD CONSTRAINT "UQ_5d1a2a2fba2df24a8d61b177c75" UNIQUE ("characterName")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "affiliate" DROP CONSTRAINT "UQ_5d1a2a2fba2df24a8d61b177c75"`,
    );
    await queryRunner.query(
      `ALTER TABLE "affiliate" DROP COLUMN "characterName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "affiliate" DROP CONSTRAINT "UQ_a9e2a42e6a59a705ddac083152b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "affiliate" DROP COLUMN "phoneNumber"`,
    );
    await queryRunner.query(
      `ALTER TABLE "affiliate" DROP CONSTRAINT "UQ_f1142f9ed3c6b00d7315047048f"`,
    );
    await queryRunner.query(`ALTER TABLE "affiliate" DROP COLUMN "battleTag"`);
    await queryRunner.query(
      `ALTER TABLE "affiliate" ADD "gameNickName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "affiliate" ADD CONSTRAINT "UQ_bc1a3c3a06cb8014064071b2599" UNIQUE ("gameNickName")`,
    );
    await queryRunner.query(
      `ALTER TABLE "affiliate" ADD "numberPhone" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "affiliate" ADD CONSTRAINT "UQ_55f1ab49e4a921f0f6253bb9a9b" UNIQUE ("numberPhone")`,
    );
    await queryRunner.query(
      `ALTER TABLE "affiliate" ADD "username" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "affiliate" ADD CONSTRAINT "UQ_0d73a01532b95569f964c80c826" UNIQUE ("username")`,
    );
  }
}
