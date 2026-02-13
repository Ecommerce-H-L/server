import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';

import {
  LoginBodySchema,
  LogoutBodySchema,
  RefreshTokenSchema,
  RegisterBodySchema,
  ResetPasswordBodySchema,
  SendOTPBodySchema,
} from './auth.model';

export class RegisterBodyDTO extends createZodDto(RegisterBodySchema) {}
export class LoginBodyDTO extends createZodDto(LoginBodySchema) {}
export class LogoutBodyDTO extends createZodDto(LogoutBodySchema) {}
export class RefreshTokenDTO extends createZodDto(RefreshTokenSchema) {}
export class ResetPasswordBody extends createZodDto(ResetPasswordBodySchema) {}
export class SendOTPBodyDTO extends createZodDto(SendOTPBodySchema) {}

// Keep response DTOs as classes for Swagger
export class RegisterUserData {
  @ApiProperty() id!: string;
  @ApiProperty() email!: string;
  @ApiProperty() firstName!: string;
  @ApiProperty() lastName!: string;
  @ApiProperty() role!: string;
  @ApiProperty() createdAt!: Date;
  @ApiProperty() updatedAt!: Date;
}

export class RegisterResponseDTO {
  @ApiProperty({ type: RegisterUserData }) user!: RegisterUserData;
  @ApiProperty() accessToken!: string;
  @ApiProperty() refreshToken!: string;
}

export class LoginResponseDTO {
  @ApiProperty() accessToken!: string;
  @ApiProperty() refreshToken!: string;
}

export class LogoutResponseDTO {
  @ApiProperty() message!: string;
}

export class RefreshTokenResponseDTO {
  @ApiProperty() accessToken!: string;
  @ApiProperty() refreshToken!: string;
}
