import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PassportModule } from '@nestjs/passport';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { config } from './database/typeOrmConfig';
@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
