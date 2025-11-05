/* eslint-disable @typescript-eslint/consistent-type-imports */
import { REQUEST_USER_KEY } from '@/common';
import type { TokenPayload } from '@/common/interfaces/jwt.interface';

declare module 'express' {
  interface Request {
    [REQUEST_USER_KEY]: TokenPayload;
  }
}
