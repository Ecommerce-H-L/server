/* eslint-disable @typescript-eslint/consistent-type-imports */
import type { TokenPayload } from '@/common';
import { REQUEST_USER_KEY } from '@/common';

declare module 'express' {
  interface Request {
    [REQUEST_USER_KEY]: TokenPayload;
  }
}
