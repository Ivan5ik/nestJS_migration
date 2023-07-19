import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY,
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    // Тут ви можете здійснити логіку перевірки та валідації JWT-токена
    // Поверніть об'єкт, який буде доступний у `request.user` у вашому гварді або контролері

    return { userId: payload.sub, username: payload.username };
  }
}
