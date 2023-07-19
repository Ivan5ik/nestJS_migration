import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret:
        'e3066cf014d01478aa6fa5ee4c65b780480e8a49483e22505375a84ed22e3615',
      signOptions: { expiresIn: '24h' },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  exports: [JwtModule],
  providers: [JwtStrategy],
})
export class AuthModule {}
