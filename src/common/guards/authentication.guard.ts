import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AUTH_TYPE, CONDITION_TYPE } from '../constants';
import { AUTH_TYPE_KEY, AuthTypeDecorator } from '../decorators/auth.decorator';
import { AuthType } from '../interfaces/auth.interface';
import { AccessTokenGuard } from './access-token.guard';
import { ApiKeyGuard } from './api-key.guard';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
    private readonly apiKeyGuard: ApiKeyGuard,
  ) {}

  private authTypeGuard(authType: AuthType): CanActivate {
    const authTypeGuardMap: Record<AuthType, CanActivate> = {
      [AUTH_TYPE.BEARER]: this.accessTokenGuard,
      [AUTH_TYPE.API_KEY]: this.apiKeyGuard,
      [AUTH_TYPE.NONE]: { canActivate: () => true },
    };
    return authTypeGuardMap[authType];
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypeValue =
      this.reflector.getAllAndOverride<AuthTypeDecorator | undefined>(
        AUTH_TYPE_KEY,
        [context.getHandler(), context.getClass()],
      ) ?? ({ authType: [AUTH_TYPE.NONE] } as AuthTypeDecorator);

    const types = Array.isArray(authTypeValue.authType)
      ? authTypeValue.authType
      : [authTypeValue.authType];

    const guards = types.map((type) => this.authTypeGuard(type));

    let error: Error | null = null;

    if (authTypeValue.options?.condition === CONDITION_TYPE.OR) {
      for (const guard of guards) {
        const canActivate = await Promise.resolve(
          guard.canActivate(context),
        ).catch((err) => {
          error = err as Error;
          return false;
        });
        if (canActivate) {
          return true;
        }
      }
      throw new UnauthorizedException(error);
    }

    if (authTypeValue.options?.condition === CONDITION_TYPE.AND) {
      for (const guard of guards) {
        const canActivate = await guard.canActivate(context);
        if (!canActivate) {
          throw new UnauthorizedException('Unauthorized');
        }
      }
      return true;
    }

    if (await guards?.[0]?.canActivate(context)) {
      return true;
    } else {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
