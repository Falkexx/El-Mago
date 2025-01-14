import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateGameserverTable1736881967057 implements MigrationInterface {
    name = 'CreateGameserverTable1736881967057'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "game_server" ("id" character varying NOT NULL, "name" character varying(150) NOT NULL, "description" character varying(150), "isDeleted" character varying NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "UQ_c5358a9184476a48b6979dc95c0" UNIQUE ("name"), CONSTRAINT "PK_cecf75ff4abc678a086839960a1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "item_game_servers_game_server" ("itemId" character varying NOT NULL, "gameServerId" character varying NOT NULL, CONSTRAINT "PK_0949fd4e0ee9ede573cf9264fc5" PRIMARY KEY ("itemId", "gameServerId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_909cc37c7455295d7d6d51c163" ON "item_game_servers_game_server" ("itemId") `);
        await queryRunner.query(`CREATE INDEX "IDX_999aede1725136b65883a2eccd" ON "item_game_servers_game_server" ("gameServerId") `);
        await queryRunner.query(`ALTER TABLE "item_game_servers_game_server" ADD CONSTRAINT "FK_909cc37c7455295d7d6d51c1639" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "item_game_servers_game_server" ADD CONSTRAINT "FK_999aede1725136b65883a2eccd3" FOREIGN KEY ("gameServerId") REFERENCES "game_server"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item_game_servers_game_server" DROP CONSTRAINT "FK_999aede1725136b65883a2eccd3"`);
        await queryRunner.query(`ALTER TABLE "item_game_servers_game_server" DROP CONSTRAINT "FK_909cc37c7455295d7d6d51c1639"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_999aede1725136b65883a2eccd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_909cc37c7455295d7d6d51c163"`);
        await queryRunner.query(`DROP TABLE "item_game_servers_game_server"`);
        await queryRunner.query(`DROP TABLE "game_server"`);
    }

}
