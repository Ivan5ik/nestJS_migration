import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login.dto';
import { User } from './user.model';
import { UserDecorator } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @UseGuards(JwtAuthGuard)
  // @Get(':userId')
  // async getUser(@UserDecorator() user: User): Promise<User> {
  //   return this.userService.getUserById(user.id);
  // }

  // @Post('create')
  // async invite(@Body() body: CreateUserDto): Promise<void> {
  //   return this.userService.createUser(body);
  // }

  // @Post('login')
  // async login(@Body() body: LoginUserDto): Promise<string> {
  //   return this.userService.loginUser(body);
  // }
}
