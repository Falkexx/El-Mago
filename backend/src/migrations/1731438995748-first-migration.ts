import { MigrationInterface, QueryRunner } from 'typeorm';

export class FirstMigration1731438995748 implements MigrationInterface {
  name = 'FirstMigration1731438995748';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" character varying NOT NULL, "firstName" character varying(20) NOT NULL, "lastName" character varying(20) NOT NULL, "name" character varying(40) NOT NULL, "email" character varying(60) NOT NULL, "cpfCnpj" character varying(40), "country" character varying(20), "password" character varying(50) NOT NULL, "discordUserName" character varying(40), "numberPhone" character varying(40) NOT NULL, "age" numeric(150), "role" character varying(20) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "isBanned" boolean NOT NULL DEFAULT false, "isDeleted" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_7af4c672f664c1be8fbadae9ade" UNIQUE ("cpfCnpj"), CONSTRAINT "UQ_a09bffa83e18bd1fc46fc1c60f7" UNIQUE ("discordUserName"), CONSTRAINT "UQ_3f352dd7c456e8803c46589d243" UNIQUE ("numberPhone"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
