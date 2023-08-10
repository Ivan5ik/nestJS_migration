import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class userTableAddNames1689682298392 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add new columns 'id_service' and 'photoProfile'
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'id_service',
        type: 'uuid',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'photo_profile',
        type: 'varchar',
        isNullable: true,
        length: '1000',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'id_service');
    await queryRunner.dropColumn('users', 'photoProfile');
  }
}
