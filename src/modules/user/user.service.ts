import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

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

  async findOne(
    column: 'id' | 'email',
    value: string,
    needChech: boolean = true,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { [column]: value },
    });

    if (!user && needChech) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async createUser(body: CreateUserDto): Promise<User> {
    if (body.password) {
      const hash = await bcrypt.hash(body.password, 10);
      body.password = hash;
    }

    const createdUser = await this.userRepository.save(body);

    if (!createdUser) {
      throw new NotFoundException('User no create');
    }
    return createdUser;
  }

  async loginUser(body: LoginUserDto): Promise<string> {
    const { email, password } = body;
    const user = await this.findOne('email', email);

    const isMatch = await bcrypt.compare(password, user.password);

    console.log('userRRR', user);

    // const { password, ...other } = user;

    if (!isMatch) {
      throw new HttpException(
        {
          status: 401,
          error: 'Incorrect password',
        },
        401,
      );
    }
    const payload = { user }; //todo

    return this.jwtService.sign(payload, {
      secret:
        'e3066cf014d01478aa6fa5ee4c65b780480e8a49483e22505375a84ed22e3615',
      expiresIn: '1h',
    });
  }
}
