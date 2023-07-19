import {
  BadRequestException,
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

    if (token) {
      console.log('ID1', token);
      const {
        user: { id },
      } = await this.jwtService.verifyAsync(token);
      console.log('ID2', id);
      this.guard(id);

      const entities = await this.userService.getUserById(id);
      if (!entities) {
        throw new BadRequestException('Invalid request.');
      }

      return entities;
    } else {
      this.guard(false);
    }
  }
}
