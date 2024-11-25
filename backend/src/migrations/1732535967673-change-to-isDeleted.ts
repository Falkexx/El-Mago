import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeToIsDeleted1732535967673 implements MigrationInterface {
    name = 'ChangeToIsDeleted1732535967673'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image" RENAME COLUMN "softDeleted" TO "isDeleted"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "softDeleted" TO "isDeleted"`);
        await queryRunner.query(`CREATE TABLE "category" ("id" character varying NOT NULL, "name" character varying(150) NOT NULL, "description" character varying(150), "html" character varying(150), "isDeleted" character varying NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "UQ_23c05c292c439d77b0de816b500" UNIQUE ("name"), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "item" ADD "categoryId" character varying`);
        await queryRunner.query(`ALTER TABLE "item" ADD CONSTRAINT "FK_c0c8f47a702c974a77812169bc2" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item" DROP CONSTRAINT "FK_c0c8f47a702c974a77812169bc2"`);
        await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "categoryId"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "isDeleted" TO "softDeleted"`);
        await queryRunner.query(`ALTER TABLE "image" RENAME COLUMN "isDeleted" TO "softDeleted"`);
    }

}
