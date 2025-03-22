import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFluentLanguagesOnAffiliateEntityAndBattleTagOnRequestAffiliate1737371528540 implements MigrationInterface {
    name = 'AddFluentLanguagesOnAffiliateEntityAndBattleTagOnRequestAffiliate1737371528540'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "affiliate_queue" ADD "battleTag" character varying(50)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "affiliate_queue" DROP COLUMN "battleTag"`);
    }

}
