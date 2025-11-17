import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { createZodDto } from 'nestjs-zod';

import { Match } from '@/common/decorators';
import type { UserRole } from '@/db/kysely/enums';

import { SendOTPBodySchema } from './auth.model';

export class RegisterBodyDTO {
  @ApiProperty({ maxLength: 254 })
  @Transform(({ value }: { value: string }) =>
    value?.toLowerCase()?.normalize('NFKC')?.trim(),
  )
  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsEmail({}, { message: 'Invalid email address' })
  @MaxLength(254, { message: 'Email must be at most 254 characters' })
  email!: string;

  @ApiProperty({ minLength: 12, maxLength: 128 })
  @Transform(({ value }: { value: string }) => value?.normalize('NFKC')?.trim())
  @IsString()
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(128, { message: 'Password must be at most 128 characters' })
  @Matches(/^\S+$/, { message: 'Password cannot contain spaces' })
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+/, {
    message: 'Include uppercase, lowercase, number, and symbol',
  })
  password!: string;

  @ApiProperty()
  @IsString()
  firstName!: string;

  @ApiProperty()
  @IsString()
  lastName!: string;

  @ApiProperty()
  @IsString()
  role!: UserRole;

  @ApiProperty()
  @Match('password', {
    message: 'Confirm password does not match with password',
  })
  confirmedPassword!: string;
}

export class RegisterUserData {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;

  @ApiProperty()
  role!: UserRole;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @Exclude()
  passwordHash!: string;
}

export class RegisterResponseDTO {
  @ApiProperty({ type: RegisterUserData })
  user!: RegisterUserData;

  @ApiProperty()
  accessToken!: string;

  @ApiProperty()
  refreshToken!: string;

  constructor(partial: Partial<RegisterResponseDTO>) {
    Object.assign(this, partial);
  }
}

export class LoginBodyDTO {
  @ApiProperty({ maxLength: 254 })
  @Transform(({ value }: { value: string }) =>
    value?.toLowerCase()?.normalize('NFKC')?.trim(),
  )
  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsEmail({}, { message: 'Invalid email address' })
  email!: string;

  @ApiProperty({ minLength: 8, maxLength: 128 })
  @Transform(({ value }: { value: string }) => value?.normalize('NFKC')?.trim())
  @IsString()
  @IsNotEmpty({ message: 'Password cannot be empty' })
  password!: string;
}

export class LoginResponseDTO {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty()
  refreshToken!: string;

  constructor(partial: Partial<LoginResponseDTO>) {
    Object.assign(this, partial);
  }
}

export class RefreshTokenDTO {
  @ApiProperty()
  @IsString()
  refreshToken!: string;
}

export class RefreshTokenResponseDTO extends LoginResponseDTO {
  constructor(partial: Partial<RefreshTokenResponseDTO>) {
    super(partial);
  }
}

export class LogoutDTO extends RefreshTokenDTO {}

export class LogoutResponseDTO {
  @ApiProperty()
  message: string;
  constructor(partial: Partial<LogoutResponseDTO>) {
    Object.assign(this, partial);
  }
}

export class SendOTPBodyDTO extends createZodDto(SendOTPBodySchema) {}
