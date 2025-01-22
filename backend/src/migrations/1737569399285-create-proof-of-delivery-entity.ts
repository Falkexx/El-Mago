import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProofOfDeliveryEntity1737569399285 implements MigrationInterface {
    name = 'CreateProofOfDeliveryEntity1737569399285'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "proof_of_delivery" ("id" character varying NOT NULL, "affiliateId" character varying NOT NULL, "clientId" character varying NOT NULL, "imageUrl" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updateAt" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_8fc2509dfe6dc0b9eafc522620c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_b921bf06270fbe85e8c3753f4c1"`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "affiliateId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "proof_of_delivery" ADD CONSTRAINT "FK_7b512d2be622f5ffb7e85e26294" FOREIGN KEY ("affiliateId") REFERENCES "affiliate"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_b921bf06270fbe85e8c3753f4c1" FOREIGN KEY ("affiliateId") REFERENCES "affiliate"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_b921bf06270fbe85e8c3753f4c1"`);
        await queryRunner.query(`ALTER TABLE "proof_of_delivery" DROP CONSTRAINT "FK_7b512d2be622f5ffb7e85e26294"`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "affiliateId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_b921bf06270fbe85e8c3753f4c1" FOREIGN KEY ("affiliateId") REFERENCES "affiliate"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP TABLE "proof_of_delivery"`);
    }

}
