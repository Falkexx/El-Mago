import { MigrationInterface, QueryRunner } from "typeorm";

export class FixPresisionAndScale1735815118710 implements MigrationInterface {
    name = 'FixPresisionAndScale1735815118710'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_item" ALTER COLUMN "price" TYPE numeric(10,3)`);
        await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "price" TYPE numeric(10,3)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "price" TYPE numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "order_item" ALTER COLUMN "price" TYPE numeric(10,2)`);
    }

}
