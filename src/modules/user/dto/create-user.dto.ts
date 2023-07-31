import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Gender } from '../user.model';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nickName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Length(8, 50, { message: 'Password must contain from 8 symbol to 50' })
  password?: string;

  @ApiPropertyOptional()
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;
}
