import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import type { Request } from 'express';

import { REQUEST_USER_KEY } from '../constants';
import type { TokenPayload } from '../interfaces/jwt.interface';

export const ActiveUser = createParamDecorator(
  (field: keyof TokenPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request[REQUEST_USER_KEY];
    return field ? user[field] : user;
  },
);
