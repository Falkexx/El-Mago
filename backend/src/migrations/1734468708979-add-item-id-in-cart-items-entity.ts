import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddItemIdInCartItemsEntity1734468708979
  implements MigrationInterface
{
  name = 'AddItemIdInCartItemsEntity1734468708979';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cart_item" DROP CONSTRAINT "FK_0b41349481bfe9247b97b40d874"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_item" ALTER COLUMN "itemId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_item" ADD CONSTRAINT "FK_0b41349481bfe9247b97b40d874" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cart_item" DROP CONSTRAINT "FK_0b41349481bfe9247b97b40d874"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_item" ALTER COLUMN "itemId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_item" ADD CONSTRAINT "FK_0b41349481bfe9247b97b40d874" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
