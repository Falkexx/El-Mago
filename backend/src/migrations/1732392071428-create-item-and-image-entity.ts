import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateItemAndImageEntity1732392071428 implements MigrationInterface {
    name = 'CreateItemAndImageEntity1732392071428'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "image" ("id" character varying NOT NULL, "name" character varying(100) NOT NULL, "mimeType" character varying(30) NOT NULL, "url" character varying NOT NULL, "bucket" character varying(30) NOT NULL, "storageProvider" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "UQ_602959dc3010ff4b4805ee7f104" UNIQUE ("url"), CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "item" ("id" character varying NOT NULL, "name" character varying NOT NULL, "type" character varying NOT NULL, "price" numeric(5) NOT NULL, "imageId" character varying, CONSTRAINT "REL_4e9b8917d85122b13f11939d7d" UNIQUE ("imageId"), CONSTRAINT "PK_d3c0c71f23e7adcf952a1d13423" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "item" ADD CONSTRAINT "FK_4e9b8917d85122b13f11939d7d8" FOREIGN KEY ("imageId") REFERENCES "image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item" DROP CONSTRAINT "FK_4e9b8917d85122b13f11939d7d8"`);
        await queryRunner.query(`DROP TABLE "item"`);
        await queryRunner.query(`DROP TABLE "image"`);
    }

}
