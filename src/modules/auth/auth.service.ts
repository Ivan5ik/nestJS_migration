import * as crypto from 'crypto';

import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';

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
    private userService: UserService, // private readonly authService: AuthService,
  ) {}

  async validateUser(tokenId: string): Promise<TokenPayload | undefined> {
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: tokenId,
      audience: GOOGLE_CLIENT_ID,
    });

    return ticket.getPayload();
  }

  async login(user: User) {
    return this.jwtService.sign({ email: user.email, id: user.id });
  }

  async register(props: any) {
    const { email, clientId } = props;
    const newUser = await this.userService.create({
      ...props,
      email,
      clientId: clientId,
    });

    return newUser;
  }

  async googleSignIn(userTokenId) {
    const userData = await this.validateUser(userTokenId);
    if (!userData) {
      throw new BadRequestException('Invalid user data.');
    }

    let newUser = await this.userService.findOne(
      'email',
      userData.email,
      false,
    );

    if (!newUser) {
      const payload: CreateUserDto = {
        nickName: userData.given_name || null,
        email: userData.email || null,
        password: null,
        gender: null,
      };

      newUser = await this.userService.create(payload);
    }

    return this.jwtService.sign(
      { ...newUser },
      {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: '1h',
      },
    );
  }
}
