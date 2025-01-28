import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeRoleOfStringToArray1737988285538 implements MigrationInterface {
    name = 'ChangeRoleOfStringToArray1737988285538'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "roles"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "roles" character varying(20) array NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "roles"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "roles" character varying(20) NOT NULL`);
    }

}
