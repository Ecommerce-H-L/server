import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { LoggerService } from '@/common/services';

import { BaseException, ExceptionDetail } from '../exceptions';

export interface ErrorResponse {
  statusCode: number;
  errorCode: string;
  message: string;
  details?: any[];
  path: string;
  timestamp: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const payload = this.toErrorResponse(exception, request);

    const msg =
      `[${payload.errorCode}] ${payload.message} | ` +
      JSON.stringify({
        reqId: request?.id,
        statusCode: payload.statusCode,
        path: payload.path,
        details: payload.details,
      });

    const trace =
      exception && typeof exception === 'object' && 'stack' in exception
        ? (exception.stack as string)
        : undefined;

    this.logger.error(msg, trace, 'AllExceptionsFilter');

    response.status(payload.statusCode).json(payload);
  }

  private toErrorResponse(exception: unknown, req: Request): ErrorResponse {
    if (exception instanceof BaseException) {
      const statusCode = exception.getStatus();
      const body = exception.getResponse() as {
        errorCode: string;
        message: string;
        details?: ExceptionDetail[];
      };
      return {
        statusCode,
        errorCode: body?.errorCode ?? 'APPLICATION_ERROR',
        message: body?.message ?? 'Application error',
        details: body?.details,
        path: req.url,
        timestamp: new Date().toISOString(),
      };
    }

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const raw = exception.getResponse();
      const norm = this.normalizeHttpExceptionBody(raw, statusCode);
      return {
        statusCode,
        errorCode: norm.errorCode,
        message: norm.message,
        details: norm.details,
        path: req.url,
        timestamp: new Date().toISOString(),
      };
    }

    const message = (exception as Error)?.message ?? 'Internal server error';
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      errorCode: 'INTERNAL_SERVER_ERROR',
      message,
      path: req.url,
      timestamp: new Date().toISOString(),
    };
  }

  private normalizeHttpExceptionBody(
    raw: unknown,
    _statusCode?: number,
  ): {
    errorCode: string;
    message: string;
    details?: ExceptionDetail[];
  } {
    if (typeof raw === 'string') {
      return {
        errorCode: 'UNKNOWN_ERROR',
        message: raw,
      };
    }
    const obj = raw as {
      errorCode?: string;
      message?: string | string[];
      details?: ExceptionDetail[];
    };

    if (Array.isArray(obj?.message)) {
      return {
        errorCode: obj?.errorCode ?? 'UNKNOWN_ERROR',
        message: 'Validation failed' + obj.message.join(', '),
      };
    }

    return {
      errorCode: obj?.errorCode ?? 'UNKNOWN_ERROR',
      message: obj?.message ?? 'Error',
      details: obj?.details,
    };
  }
}
