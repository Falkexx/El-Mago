import { MigrationInterface, QueryRunner } from "typeorm";

export class DefineAmountAsNull1732397715052 implements MigrationInterface {
    name = 'DefineAmountAsNull1732397715052'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "amount" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "amount" SET NOT NULL`);
    }

}
