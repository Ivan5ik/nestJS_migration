import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import { User } from './user.model';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    delete user.password;

    return user;
  }

  async createUser(body: CreateUserDto): Promise<void> {
    const user = new User();
    user.nick_name = body.nickName;
    user.email = body.email;
    user.password = body.password;
    user.gender = body.gender;

    const createdUser = await this.userRepository.save(user);

    if (!createdUser) {
      throw new NotFoundException('User no create');
    } else {
      throw new NotFoundException('Successes user');
    }
  }

  async loginUser(body: LoginUserDto): Promise<string> {
    const { email, password } = body;
    const user = await this.userRepository.findOne({ where: { email } });
    console.log('userRRR', user);
    if (!user) {
      throw new HttpException(
        {
          status: 401,
          error: 'User not found',
        },
        401,
      );
    }

    if (user.password !== password) {
      throw new HttpException(
        {
          status: 401,
          error: 'Incorrect password',
        },
        401,
      );
    }
    const payload = { user };

    return this.jwtService.sign(payload, {
      secret:
        'e3066cf014d01478aa6fa5ee4c65b780480e8a49483e22505375a84ed22e3615',
      expiresIn: '1h',
    });
  }
}
