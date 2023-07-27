import { Controller, UseGuards, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from './user.model';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { UserDecorator } from 'src/decorators/user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: User })
  @ApiOperation({ summary: 'Get user by id' })
  @Get()
  async getUser(@UserDecorator() user: User): Promise<User> {
    return this.userService.findOne<User>('id', user.id);
  }
}
