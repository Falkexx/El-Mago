import { MigrationInterface, QueryRunner } from "typeorm";

export class AddJoinColumnInAffiliateWithUser1731849894524 implements MigrationInterface {
    name = 'AddJoinColumnInAffiliateWithUser1731849894524'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "affiliate" ADD "userId" character varying`);
        await queryRunner.query(`ALTER TABLE "affiliate" ADD CONSTRAINT "UQ_7ea0af8c910211e1b7ed0406d15" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "affiliate" ADD CONSTRAINT "FK_7ea0af8c910211e1b7ed0406d15" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "affiliate" DROP CONSTRAINT "FK_7ea0af8c910211e1b7ed0406d15"`);
        await queryRunner.query(`ALTER TABLE "affiliate" DROP CONSTRAINT "UQ_7ea0af8c910211e1b7ed0406d15"`);
        await queryRunner.query(`ALTER TABLE "affiliate" DROP COLUMN "userId"`);
    }

}
