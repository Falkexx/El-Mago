import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixCategoriesAndItensRelations1734094115513
  implements MigrationInterface
{
  name = 'FixCategoriesAndItensRelations1734094115513';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "item" DROP CONSTRAINT "FK_894787a92f6ec0fcdf6419a38ae"`,
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
    await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "categoriesId"`);
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
      `ALTER TABLE "item" ADD "categoriesId" character varying`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cbcba68e69901ab873ec441a7b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_32e0f47e48497fc3647e82c4ee"`,
    );
    await queryRunner.query(`DROP TABLE "item_categories_category"`);
    await queryRunner.query(
      `ALTER TABLE "item" ADD CONSTRAINT "FK_894787a92f6ec0fcdf6419a38ae" FOREIGN KEY ("categoriesId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
