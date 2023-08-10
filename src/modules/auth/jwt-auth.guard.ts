import {
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import Express from 'express';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    @Inject(REQUEST)
    private readonly request: Express.Request,
    private jwtService: JwtService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {
    super();
  }

  private getTokenFromRequest(request: Express.Request): string | undefined {
    const header = request.get('authorization');
    const [bearer, token] = header?.split(' ') || [];

    if (bearer === 'Bearer' && token) {
      return token;
    }
  }

  private guard(value: any): void {
    if (!value) {
      throw new UnauthorizedException();
    }
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async handleRequest() {
    const token = this.getTokenFromRequest(this.request);

    if (!token) {
      this.guard(false);
    }

    const {
      user: { id: userId },
    } = await this.jwtService.verifyAsync(token);

    this.guard(userId);

    const entities = await this.userService.findOne('id', userId);

    return entities;
  }
}
