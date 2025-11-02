import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

import { Env } from '@/config/env';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService<Env, true>,
  ) {}

  sign<T extends object>(payload: T, options: Partial<JwtSignOptions>): string {
    return this.jwtService.sign(payload, {
      ...options,
      algorithm: 'HS256',
    });
  }

  signAccessToken<T extends object>(payload: T): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: this.config.get('ACCESS_TOKEN_EXPIRES_IN'),
      secret: this.config.get('ACCESS_TOKEN_SECRET'),
    });
  }

  signRefreshToken<T extends object>(payload: T): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: this.config.get('REFRESH_TOKEN_EXPIRES_IN'),
      secret: this.config.get('REFRESH_TOKEN_SECRET'),
    });
  }

  verifyRefreshToken<T extends object>(token: string): Promise<T> {
    return this.jwtService.verifyAsync<T>(token, {
      secret: this.config.get('REFRESH_TOKEN_SECRET'),
    });
  }
  verifyAccessToken<T extends object>(token: string): Promise<T> {
    return this.jwtService.verifyAsync<T>(token, {
      secret: this.config.get('ACCESS_TOKEN_SECRET'),
    });
  }
}
