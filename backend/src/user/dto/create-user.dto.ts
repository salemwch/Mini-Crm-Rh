import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  RH = 'rh',
}

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
  @ApiProperty()
  @IsEnum(UserRole)
  role: UserRole;
  @IsOptional()
  @IsString()
  @ApiProperty()
  phoneNumber?: string;
  refreshToken:  string |null;
  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;
}
