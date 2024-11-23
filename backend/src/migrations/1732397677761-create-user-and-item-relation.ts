import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserAndItemRelation1732397677761
  implements MigrationInterface
{
  name = 'CreateUserAndItemRelation1732397677761';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "item" ADD "amount" integer NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "item" ADD "isInfinite" boolean NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ADD "userId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ADD CONSTRAINT "FK_5369db3bd33839fd3b0dd5525d1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "item" DROP CONSTRAINT "FK_5369db3bd33839fd3b0dd5525d1"`,
    );
    await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "isInfinite"`);
    await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "amount"`);
  }
}
