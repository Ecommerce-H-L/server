import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import pino from 'pino';

import {
  isNotFoundPrismaError,
  isUniqueConstraintPrismaError,
} from '@/utils/prisma-error.util';

export interface PrismaError extends Error {
  code: string;
  meta?: Record<string, any>;
}

@Catch(Prisma.PrismaClientKnownRequestError, Prisma.PrismaClientValidationError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(e: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    pino().error({ err: e, path: req.path }, 'Prisma exception');

    if (isUniqueConstraintPrismaError(e)) {
      const targets = e.meta?.target;
      const targetStr = Array.isArray(targets) ? targets.join(', ') : targets;
      return res.status(409).json({
        statusCode: 409,
        message: `Duplicate value for: ${targetStr as string}`,
      });
    }

    if (isNotFoundPrismaError(e)) {
      return res
        .status(404)
        .json({ statusCode: 404, message: 'Resource not found' });
    }
    if (e instanceof Prisma.PrismaClientValidationError) {
      return res
        .status(400)
        .json({ statusCode: 400, message: 'Invalid data sent to database' });
    }
    return res.status(500).json({
      statusCode: 500,
      message: (e as Error)?.message || 'Database error',
    });
  }
}
