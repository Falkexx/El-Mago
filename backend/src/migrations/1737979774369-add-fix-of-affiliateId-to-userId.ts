import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFixOfAffiliateIdToUserId1737979774369 implements MigrationInterface {
    name = 'AddFixOfAffiliateIdToUserId1737979774369'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "affiliate" DROP CONSTRAINT "FK_7ea0af8c910211e1b7ed0406d15"`);
        await queryRunner.query(`ALTER TABLE "affiliate" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "affiliate" ADD CONSTRAINT "FK_7ea0af8c910211e1b7ed0406d15" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "affiliate" DROP CONSTRAINT "FK_7ea0af8c910211e1b7ed0406d15"`);
        await queryRunner.query(`ALTER TABLE "affiliate" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "affiliate" ADD CONSTRAINT "FK_7ea0af8c910211e1b7ed0406d15" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
