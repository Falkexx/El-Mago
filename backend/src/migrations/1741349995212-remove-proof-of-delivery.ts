import { TABLE } from 'src/@metadata/tables';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveProofOfDelivery1741349995212 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS ${TABLE.proof_of_delivery}`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
