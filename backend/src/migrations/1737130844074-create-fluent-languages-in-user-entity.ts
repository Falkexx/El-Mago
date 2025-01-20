import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFluentLanguagesInUserEntity1737130844074 implements MigrationInterface {
    name = 'CreateFluentLanguagesInUserEntity1737130844074'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "fluentLanguages" character varying array NOT NULL DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "fluentLanguages"`);
    }

}
