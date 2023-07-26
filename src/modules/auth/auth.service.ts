import * as crypto from 'crypto';

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const oAuth2Client = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  'postmessage',
);

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private userService: UserService,
  ) {}

  async validateUser(tokenId: string): Promise<TokenPayload | undefined> {
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: tokenId,
      audience: GOOGLE_CLIENT_ID,
    });

    return ticket.getPayload();
  }

  async login(user: User) {
    const payload = { email: user.email, id: user.id };

    return this.jwtService.sign(payload);
  }

  async register(props: any) {
    const { email, clientId } = props;

    const newUser: any = await this.userService.createUser({
      ...props,
      email,
      clientId: clientId,
    });

    const user = newUser.get({ plain: true });

    return { user };
  }
}
