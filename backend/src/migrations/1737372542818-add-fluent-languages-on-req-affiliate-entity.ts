import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFluentLanguagesOnReqAffiliateEntity1737372542818 implements MigrationInterface {
    name = 'AddFluentLanguagesOnReqAffiliateEntity1737372542818'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "affiliate_queue" ADD "fluentLanguages" character varying array NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "affiliate_queue" DROP COLUMN "fluentLanguages"`);
    }

}
