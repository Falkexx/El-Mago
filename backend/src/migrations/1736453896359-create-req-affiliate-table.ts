import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateReqAffiliateTable1736453896359
  implements MigrationInterface
{
  name = 'CreateReqAffiliateTable1736453896359';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "affiliate_queue" ("id" character varying NOT NULL, "name" character varying(60) NOT NULL, "email" character varying(120) NOT NULL, "discord" character varying(50) NOT NULL, "characterName" character varying(50) NOT NULL, "phoneNumber" character varying(50) NOT NULL, "cpf" character varying(50) NOT NULL, "country" character varying(50) NOT NULL, "status" character varying(20) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "deletedAt" character varying(50), "userId" character varying, CONSTRAINT "REL_ecdc96c56cd0be7203705aced9" UNIQUE ("userId"), CONSTRAINT "PK_f39ef0e16883531095b2c7ae187" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "affiliate_queue" ADD CONSTRAINT "FK_ecdc96c56cd0be7203705aced99" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "affiliate_queue" DROP CONSTRAINT "FK_ecdc96c56cd0be7203705aced99"`,
    );
    await queryRunner.query(`DROP TABLE "affiliate_queue"`);
  }
}
