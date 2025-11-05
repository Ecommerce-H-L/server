import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AccessTokenGuard } from '@/common';

import {
  LoginBodyDTO,
  LoginResponseDTO,
  LogoutDTO,
  LogoutResponseDTO,
  RefreshTokenDTO,
  RefreshTokenResponseDTO,
  RegisterBodyDTO,
  RegisterResponseDTO,
} from './auth.dto';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse({ type: RegisterResponseDTO })
  async register(@Body() body: RegisterBodyDTO): Promise<RegisterResponseDTO> {
    const result = await this.authService.register(body);
    return new RegisterResponseDTO(result);
  }

  @Post('login')
  @ApiOkResponse({ type: LoginResponseDTO })
  async login(@Body() body: LoginBodyDTO): Promise<LoginResponseDTO> {
    const result = await this.authService.login(body);
    return new LoginResponseDTO(result);
  }

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: RefreshTokenResponseDTO })
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Body() body: RefreshTokenDTO,
  ): Promise<RefreshTokenResponseDTO> {
    const result = await this.authService.refreshTokens(body.refreshToken);
    return new RefreshTokenResponseDTO(result);
  }

  @Post('logout')
  @ApiOkResponse({ type: LogoutResponseDTO })
  @HttpCode(HttpStatus.OK)
  async logout(@Body() body: LogoutDTO): Promise<LogoutResponseDTO> {
    const res = await this.authService.logout(body.refreshToken);
    return new LogoutResponseDTO(res);
  }
}
