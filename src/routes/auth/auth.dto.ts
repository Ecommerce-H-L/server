import { Exclude } from 'class-transformer';
import { IsString, Length } from 'class-validator';

import { Match } from '@/common/decorators';
import type { UserRole } from '@/db/kysely/enums';

export class LoginDTO {
  @IsString()
  email: string;

  @IsString()
  @Length(6, 20, { message: 'Password must be between 6 and 20 characters' })
  password: string;
}

export class RegisterBodyDTO extends LoginDTO {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  role: UserRole;

  @Match('password', {
    message: 'Confirm password does not match with password',
  })
  confirmedPassword: string;
}

export class RegisterResponseDTO {
  data: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
  };

  @Exclude()
  passwordHash: string;

  constructor(partial: Partial<RegisterResponseDTO>) {
    Object.assign(this, partial);
  }
}

export class LoginBodyDTO {
  @IsString()
  email: string;

  @IsString()
  password: string;
}

export class LoginResponseDTO {
  accessToken: string;
  refreshToken: string;

  constructor(partial: Partial<LoginResponseDTO>) {
    Object.assign(this, partial);
  }
}

export class RefreshTokenDTO {
  @IsString()
  refreshToken: string;
}

export class RefreshTokenResponseDTO extends LoginResponseDTO {
  constructor(partial: Partial<RefreshTokenResponseDTO>) {
    super(partial);
  }
}

export class LogoutResponseDTO {
  message: string;
  constructor(partial: Partial<LogoutResponseDTO>) {
    Object.assign(this, partial);
  }
}
