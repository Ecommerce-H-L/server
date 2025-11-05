import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsString, Length } from 'class-validator';

import { Match } from '@/common/decorators';
import type { UserRole } from '@/db/kysely/enums';

export class LoginDTO {
  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  @Length(6, 20, { message: 'Password must be between 6 and 20 characters' })
  password: string;
}

export class RegisterBodyDTO extends LoginDTO {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  role: UserRole;

  @ApiProperty()
  @Match('password', {
    message: 'Confirm password does not match with password',
  })
  confirmedPassword: string;
}

export class RegisterUserData {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  role: UserRole;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class RegisterResponseDTO {
  @ApiProperty({ type: RegisterUserData })
  data: RegisterUserData;

  @Exclude()
  passwordHash: string;

  constructor(partial: Partial<RegisterResponseDTO>) {
    Object.assign(this, partial);
  }
}

export class LoginBodyDTO {
  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class LoginResponseDTO {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  constructor(partial: Partial<LoginResponseDTO>) {
    Object.assign(this, partial);
  }
}

export class RefreshTokenDTO {
  @ApiProperty()
  @IsString()
  refreshToken: string;
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
