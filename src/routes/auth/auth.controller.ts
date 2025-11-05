import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AccessTokenGuard } from '@/common';

import {
  LoginBodyDTO,
  LoginResponseDTO,
  LogoutResponseDTO,
  RefreshTokenDTO,
  RefreshTokenResponseDTO,
  RegisterBodyDTO,
  RegisterResponseDTO,
} from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterBodyDTO): Promise<RegisterResponseDTO> {
    const result = await this.authService.register(body);
    return new RegisterResponseDTO(result);
  }

  @Post('login')
  async login(@Body() body: LoginBodyDTO): Promise<LoginResponseDTO> {
    const result = await this.authService.login(body);
    return new LoginResponseDTO(result);
  }

  @UseGuards(AccessTokenGuard)
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Body() body: RefreshTokenDTO,
  ): Promise<RefreshTokenResponseDTO> {
    const result = await this.authService.refreshTokens(body.refreshToken);
    return new RefreshTokenResponseDTO(result);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() body: RefreshTokenDTO): Promise<LogoutResponseDTO> {
    const res = await this.authService.logout(body.refreshToken);
    return new LogoutResponseDTO(res);
  }
}
