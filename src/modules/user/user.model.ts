import { IsEmail } from 'class-validator';
import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

@Entity('users')
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: string;

  @ApiProperty({ description: 'Name User' })
  @Column({ nullable: true, name: 'nick_name' })
  nickName: string;

  @ApiProperty({ example: 'test1@example.com' })
  @Column({ nullable: false })
  @IsEmail()
  email: string;

  @ApiProperty()
  @Column()
  @Exclude()
  password: string;

  @ApiProperty({
    description: 'Choose gender (MALE or FEMALE)',
    enum: Gender,
  })
  @Column({
    type: 'enum',
    enum: Gender,
    nullable: false,
  })
  gender: Gender;

  @ApiProperty({ description: 'ID of the service' })
  @Column({ nullable: true, name: 'id_service' })
  idService: string;

  @ApiProperty({ description: 'Array of photo URLs' })
  @Column({ nullable: true, name: 'photo_profile' })
  photoProfile: string;
}
