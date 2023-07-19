import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Gender } from '../user.model';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nickName?: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @Length(8, 50, { message: 'Password must contain from 8 symbol to 50' })
  password: string;

  @ApiProperty()
  @IsEnum(Gender)
  gender: Gender;
}
