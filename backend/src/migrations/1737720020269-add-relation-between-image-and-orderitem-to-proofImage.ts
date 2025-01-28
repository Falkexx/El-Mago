import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRelationBetweenImageAndOrderitemToProofImage1737720020269 implements MigrationInterface {
    name = 'AddRelationBetweenImageAndOrderitemToProofImage1737720020269'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_item" ADD "proofImageId" character varying`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD CONSTRAINT "UQ_d25a804c96ef65f166cce6bd6cd" UNIQUE ("proofImageId")`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD CONSTRAINT "FK_d25a804c96ef65f166cce6bd6cd" FOREIGN KEY ("proofImageId") REFERENCES "image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_d25a804c96ef65f166cce6bd6cd"`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "UQ_d25a804c96ef65f166cce6bd6cd"`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP COLUMN "proofImageId"`);
    }

}
