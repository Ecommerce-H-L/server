import { SetMetadata } from '@nestjs/common';

import type { AuthCondition, AuthType } from '../interfaces/auth.interface';

export const AUTH_TYPE_KEY = 'authType';

export interface AuthTypeDecorator {
  authType: AuthType[];
  options?: {
    condition?: AuthCondition;
  };
}

export function Auth(authType: AuthType): ReturnType<typeof SetMetadata>;

export function Auth(
  authType: AuthType[],
  options: { condition: AuthCondition },
): ReturnType<typeof SetMetadata>;

export function Auth(
  authType: AuthType | AuthType[],
  options?: { condition?: AuthCondition },
): ReturnType<typeof SetMetadata> {
  return SetMetadata(AUTH_TYPE_KEY, {
    authType: Array.isArray(authType) ? authType : [authType],
    options,
  });
}
