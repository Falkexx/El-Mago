import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFluentLanguagesInAffiliateEntity1737125831860 implements MigrationInterface {
    name = 'CreateFluentLanguagesInAffiliateEntity1737125831860'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."affiliate_fluentlanguages_enum" AS ENUM('português brasil', 'português portugal', 'english united states', 'english united kingdom', 'español españa', 'español méxico', 'français france', 'deutsch deutschland', 'italiano italia', '日本語 日本', '中文 中国', '한국어 한국', 'हिंदी भारत', 'русский россия', 'العربية السعودية')`);
        await queryRunner.query(`ALTER TABLE "affiliate" ADD "fluentLanguages" "public"."affiliate_fluentlanguages_enum" array NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "affiliate" DROP COLUMN "fluentLanguages"`);
        await queryRunner.query(`DROP TYPE "public"."affiliate_fluentlanguages_enum"`);
    }

}
