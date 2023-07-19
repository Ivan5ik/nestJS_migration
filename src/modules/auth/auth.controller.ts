import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
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

@ApiTags('Auth Controller')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: User })
  @ApiOperation({ summary: 'Get user by id' })
  @Get(':userId')
  async getUser(@UserDecorator() user: User): Promise<User> {
    return this.userService.getUserById(user.id);
  }

  @ApiOkResponse({ type: User })
  @ApiOperation({ summary: 'Sign Up new user' })
  @Post('signUp')
  async invite(@Body() body: CreateUserDto): Promise<void> {
    return this.userService.createUser(body);
  }

  @ApiOkResponse({ type: User })
  @ApiOperation({ summary: 'Login registered user' })
  @Post('login')
  async login(@Body() body: LoginUserDto): Promise<string> {
    return this.userService.loginUser(body);
  }
}
