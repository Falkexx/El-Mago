import { MigrationInterface, QueryRunner } from 'typeorm';

export class DefineCategoriesAsList1734093382423 implements MigrationInterface {
  name = 'DefineCategoriesAsList1734093382423';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "item" DROP CONSTRAINT "FK_c0c8f47a702c974a77812169bc2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" RENAME COLUMN "categoryId" TO "categoriesId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ADD CONSTRAINT "FK_894787a92f6ec0fcdf6419a38ae" FOREIGN KEY ("categoriesId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "item" DROP CONSTRAINT "FK_894787a92f6ec0fcdf6419a38ae"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" RENAME COLUMN "categoriesId" TO "categoryId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ADD CONSTRAINT "FK_c0c8f47a702c974a77812169bc2" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
