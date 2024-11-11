import { TABLE } from 'src/@metadata/tables';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class FirstMigration1731341972076 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TABLE.user,
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'firstName',
            type: 'varchar',
            length: '20',
          },
          {
            name: 'lastName',
            type: 'varchar',
            length: '20',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '40',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '60',
          },

          {
            name: 'cpfCnpj',
            type: 'varchar',
            length: '40',
          },
          {
            name: 'country',
            type: 'varchar',
            length: '20',
          },
          {
            name: 'password',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'discordUserName',
            type: 'varchar',
            length: '40',
          },
          {
            name: 'numberPhone',
            type: 'varchar',
            length: '40',
          },
          {
            name: 'age',
            type: 'int',
            precision: 150,
          },
          {
            name: 'role',
            type: 'varchar',
            length: '20',
          },
          {
            name: 'createdAt',
            type: 'timestamptz',
          },
          {
            name: 'updatedAt',
            type: 'timestamptz',
          },
          {
            name: 'isBanned',
            type: 'boolean',
            default: false,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TABLE.user);
  }
}
