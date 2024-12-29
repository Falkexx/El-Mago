import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrderStatusTable1735261073654 implements MigrationInterface {
  name = 'CreateOrderStatusTable1735261073654';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "order_status" ("id" character varying NOT NULL, "title" character varying NOT NULL, "description" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "orderId" character varying, CONSTRAINT "PK_8ea75b2a26f83f3bc98b9c6aaf6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_status" ADD CONSTRAINT "FK_014fe4a8ab95c64fdb7b8beb253" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_caabe91507b3379c7ba73637b84"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_status" DROP CONSTRAINT "FK_014fe4a8ab95c64fdb7b8beb253"`,
    );
    await queryRunner.query(`DROP TABLE "order_status"`);
  }
}
