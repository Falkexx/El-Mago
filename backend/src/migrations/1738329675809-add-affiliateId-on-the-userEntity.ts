import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAffiliateIdOnTheUserEntity1738329675809 implements MigrationInterface {
    name = 'AddAffiliateIdOnTheUserEntity1738329675809'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "affiliateId" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_9e17785fc294bf6a580ffe1560d" UNIQUE ("affiliateId")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_9e17785fc294bf6a580ffe1560d" FOREIGN KEY ("affiliateId") REFERENCES "affiliate"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_9e17785fc294bf6a580ffe1560d"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_9e17785fc294bf6a580ffe1560d"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "affiliateId"`);
    }

}
