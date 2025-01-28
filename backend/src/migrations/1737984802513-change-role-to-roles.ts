import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeRoleToRoles1737984802513 implements MigrationInterface {
    name = 'ChangeRoleToRoles1737984802513'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "role" TO "roles"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "roles" TO "role"`);
    }

}
