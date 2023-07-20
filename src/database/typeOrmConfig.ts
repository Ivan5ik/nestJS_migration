import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import 'dotenv/config'; // <- this line is the important

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: !process.env.DB_SYNCHRONIZE,
  logging: !process.env.DB_LOGGING,
  entities: [process.env.DB_ENTITIES],
  migrations: [process.env.DB_MIGRATIONS],
  // cli: {
  //   migrationsDir: process.env.DB_MIGRATIONS_DIR,
  // },
  migrationsRun: !process.env.DB_MIGRATIONS_RUN,
  migrationsTableName: process.env.DB_MIGRATIONS_TABLE_NAME,
};
export const typeOrmConfig = config;
