import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePlatformNickNameAndBattleTagInOrder1736445944953 implements MigrationInterface {
    name = 'CreatePlatformNickNameAndBattleTagInOrder1736445944953'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ADD "platform" character varying(120)`);
        await queryRunner.query(`ALTER TABLE "order" ADD "nickName" character varying(120) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ADD "battleTag" character varying(120) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "battleTag"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "nickName"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "platform"`);
    }

}
