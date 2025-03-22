import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDiscordInAffiliateEntity1737122906780
  implements MigrationInterface
{
  name = 'AddDiscordInAffiliateEntity1737122906780';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "affiliate" ADD "discord" character varying(50) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "affiliate" DROP COLUMN "discord"`);
  }
}
