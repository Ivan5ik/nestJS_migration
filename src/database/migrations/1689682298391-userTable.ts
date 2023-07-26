import { Gender } from 'src/modules/user/user.model';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export class userTable1689682298391 implements MigrationInterface {
  name = 'userTable1689682298391';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isUnique: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'nick_name',
            type: 'varchar',
            isNullable: true,
            length: '50',
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: false,
            length: '255',
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: true,
            length: '255',
          },
          {
            name: 'gender',
            type: 'enum',
            enum: [Gender.MALE, Gender.FEMALE],
            isNullable: true,
          },
        ],
      }),
    );

    const users = await queryRunner.query('SELECT * FROM users');
    for (const user of users) {
      await queryRunner.query(
        `UPDATE users SET id = '${uuidv4()}' WHERE id = '${user.id}'`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
