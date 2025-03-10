import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameToDigitalShipping1741205680899
  implements MigrationInterface
{
  name = 'RenameToDigitalShipping1741205680899';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "digital_shipping" ("id" character varying NOT NULL, "finishedAt" TIMESTAMP WITH TIME ZONE, "deadLineForDelivery" TIMESTAMP WITH TIME ZONE, "deletedAt" TIMESTAMP WITH TIME ZONE, "affiliateId" character varying(40) NOT NULL, "voucher" jsonb NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "orderId" character varying(40) NOT NULL, CONSTRAINT "UQ_91cad62e18679759dbaed8aab99" UNIQUE ("orderId"), CONSTRAINT "REL_91cad62e18679759dbaed8aab9" UNIQUE ("orderId"), CONSTRAINT "PK_5b20040ac0bf8e870b3f9d09592" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_91cad62e18679759dbaed8aab9" ON "digital_shipping" ("orderId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "digital_shipping" ADD CONSTRAINT "FK_91cad62e18679759dbaed8aab99" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "digital_shipping" DROP CONSTRAINT "FK_91cad62e18679759dbaed8aab99"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_91cad62e18679759dbaed8aab9"`,
    );
    await queryRunner.query(`DROP TABLE "digital_shipping"`);
  }
}
