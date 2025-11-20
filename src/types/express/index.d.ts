/* eslint-disable @typescript-eslint/consistent-type-imports */
import type { TokenPayload } from '@/shared';
import { REQUEST_USER_KEY } from '@/shared';

declare module 'express' {
  interface Request {
    [REQUEST_USER_KEY]: TokenPayload;
  }
}
