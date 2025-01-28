import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCompletedAtOrder1737975222102 implements MigrationInterface {
    name = 'AddCompletedAtOrder1737975222102'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ADD "completedAt" boolean`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "completedAt"`);
    }

}
