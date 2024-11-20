import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAffiliateEntity1731839747338 implements MigrationInterface {
  name = 'CreateAffiliateEntity1731839747338';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "affiliate" ("id" character varying NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "username" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "idSoftDelete" boolean NOT NULL, CONSTRAINT "UQ_24ffdd2ffe17ef39b9942167213" UNIQUE ("email"), CONSTRAINT "UQ_0d73a01532b95569f964c80c826" UNIQUE ("username"), CONSTRAINT "PK_1ce9ae335b25b11224e2756cfdc" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "affiliate"`);
  }
}
