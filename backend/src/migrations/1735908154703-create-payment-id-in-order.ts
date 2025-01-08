import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePaymentIdInOrder1735908154703 implements MigrationInterface {
    name = 'CreatePaymentIdInOrder1735908154703'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ADD "paymentId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "paymentId"`);
    }

}
