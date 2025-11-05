import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

import { REQUEST_USER_KEY } from '../constants/auth.constant';
import { TokenService } from '../services';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    const [scheme, accessToken] = authHeader.split(' ');
    if (!accessToken || scheme?.toLowerCase() !== 'bearer') {
      throw new UnauthorizedException('Malformed Authorization header');
    }

    try {
      const decodedAccessToken =
        await this.tokenService.verifyAccessToken(accessToken);
      req[REQUEST_USER_KEY] = decodedAccessToken;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
