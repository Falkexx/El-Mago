import { MigrationInterface, QueryRunner } from "typeorm";

export class DefineDigitalShippingIdAsNull1741376383117 implements MigrationInterface {
    name = 'DefineDigitalShippingIdAsNull1741376383117'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_5a4fe092b21638cf168780cc039"`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "digitalShippingId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_5a4fe092b21638cf168780cc039" FOREIGN KEY ("digitalShippingId") REFERENCES "digital_shipping"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_5a4fe092b21638cf168780cc039"`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "digitalShippingId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_5a4fe092b21638cf168780cc039" FOREIGN KEY ("digitalShippingId") REFERENCES "digital_shipping"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
