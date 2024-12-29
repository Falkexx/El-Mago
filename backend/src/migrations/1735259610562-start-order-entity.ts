import { MigrationInterface, QueryRunner } from 'typeorm';

export class StartOrderEntity1735259610562 implements MigrationInterface {
  name = 'StartOrderEntity1735259610562';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "item" DROP CONSTRAINT "FK_c0c8f47a702c974a77812169bc2"`,
    );
    await queryRunner.query(
      `CREATE TABLE "cart" ("id" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "userId" character varying NOT NULL, CONSTRAINT "UQ_756f53ab9466eb52a52619ee019" UNIQUE ("userId"), CONSTRAINT "REL_756f53ab9466eb52a52619ee01" UNIQUE ("userId"), CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cart_item" ("id" character varying NOT NULL, "amount" integer NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "itemId" character varying NOT NULL, "cartId" character varying, CONSTRAINT "PK_bd94725aa84f8cf37632bcde997" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "order" ("id" character varying NOT NULL, "name" character varying NOT NULL, "coupon" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "userId" character varying NOT NULL, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_caabe91507b3379c7ba73637b8" ON "order" ("userId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "item_categories_category" ("itemId" character varying NOT NULL, "categoryId" character varying NOT NULL, CONSTRAINT "PK_f5125ad13291eb883608b794cb9" PRIMARY KEY ("itemId", "categoryId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_32e0f47e48497fc3647e82c4ee" ON "item_categories_category" ("itemId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cbcba68e69901ab873ec441a7b" ON "item_categories_category" ("categoryId") `,
    );
    await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "categoryId"`);
    await queryRunner.query(
      `ALTER TABLE "cart" ADD CONSTRAINT "FK_756f53ab9466eb52a52619ee019" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_item" ADD CONSTRAINT "FK_29e590514f9941296f3a2440d39" FOREIGN KEY ("cartId") REFERENCES "cart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_item" ADD CONSTRAINT "FK_0b41349481bfe9247b97b40d874" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_categories_category" ADD CONSTRAINT "FK_32e0f47e48497fc3647e82c4ee5" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_categories_category" ADD CONSTRAINT "FK_cbcba68e69901ab873ec441a7b6" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "item_categories_category" DROP CONSTRAINT "FK_cbcba68e69901ab873ec441a7b6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_categories_category" DROP CONSTRAINT "FK_32e0f47e48497fc3647e82c4ee5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_item" DROP CONSTRAINT "FK_0b41349481bfe9247b97b40d874"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_item" DROP CONSTRAINT "FK_29e590514f9941296f3a2440d39"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" DROP CONSTRAINT "FK_756f53ab9466eb52a52619ee019"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ADD "categoryId" character varying`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cbcba68e69901ab873ec441a7b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_32e0f47e48497fc3647e82c4ee"`,
    );
    await queryRunner.query(`DROP TABLE "item_categories_category"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_caabe91507b3379c7ba73637b8"`,
    );
    await queryRunner.query(`DROP TABLE "order"`);
    await queryRunner.query(`DROP TABLE "cart_item"`);
    await queryRunner.query(`DROP TABLE "cart"`);
    await queryRunner.query(
      `ALTER TABLE "item" ADD CONSTRAINT "FK_c0c8f47a702c974a77812169bc2" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
