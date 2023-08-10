import { Controller, Post, Body, Query } from '@nestjs/common';
import { User } from '../user/user.model';
import { LoginUserDto } from '../user/dto/login.dto';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('Auth Controller')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @ApiOkResponse({ type: User })
  @ApiOperation({ summary: 'Sign Up user' })
  @Post('sign-up')
  async invite(@Body() body: CreateUserDto): Promise<void> {
    await this.userService.create(body);
    return;
  }

  @ApiOkResponse({ type: User })
  @ApiOperation({ summary: 'Sign in user' })
  @Post('sign-in')
  async login(@Body() body: LoginUserDto): Promise<string> {
    return this.userService.login(body);
  }

  @Post('google-sign-in')
  async loginGoogle(
    @Query('userTokenId') userTokenId: string,
  ): Promise<string> {
    return this.authService.googleSignIn(userTokenId);
  }

  @Post('spotify-sign-in')
  async loginSpotify(@Body() body: any): Promise<string> {
    return this.authService.spotifySignIn(body);
  }
}
