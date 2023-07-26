import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { UserDecorator } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
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
import { JwtService } from '@nestjs/jwt';
import { error } from 'console';

@ApiTags('Auth Controller')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: User })
  @ApiOperation({ summary: 'Get user by id' })
  @Get()
  async getUser(@UserDecorator() user: User): Promise<User> {
    return this.userService.findOne('id', user.id);
  }

  @ApiOkResponse({ type: User })
  @ApiOperation({ summary: 'Sign Up user' })
  @Post('sign-up')
  async invite(@Body() body: CreateUserDto): Promise<void> {
    await this.userService.createUser(body);
    return;
  }

  @ApiOkResponse({ type: User })
  @ApiOperation({ summary: 'Sign in user' })
  @Post('sign-in')
  async login(@Body() body: LoginUserDto): Promise<string> {
    return this.userService.loginUser(body);
  }

  @Post('google-sign-in')
  async loginGoogle(
    @Query('userTokenId') userTokenId: string,
  ): Promise<string> {
    const userData = await this.authService.validateUser(userTokenId);
    if (!userData) {
      throw new BadRequestException('Invalid user data.');
    }

    const user: User | boolean = await this.userService.findOne(
      'email',
      userData.email,
      false,
    );

    if (!user) {
      const payload: CreateUserDto = {
        nickName: userData.given_name || null,
        email: userData.email || null,
        password: null,
        gender: null,
      };

      const newUser = await this.userService.createUser(payload);

      return this.jwtService.sign(newUser, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: '1h',
      });
    }
    return this.jwtService.sign(user as User, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: '1h',
    });
  }
}
