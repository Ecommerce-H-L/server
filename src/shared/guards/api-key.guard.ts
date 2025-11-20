import {
  type CanActivate,
  type ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import type { Request } from 'express';

import type { Env } from '@/config/env';

export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService<Env>) {}
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const apiKeyHeader = req.headers['x-api-key'];

    if (apiKeyHeader === this.configService.get('SECRET_API_KEY')) {
      return true;
    }
    throw new UnauthorizedException('Unauthorized');
  }
}
