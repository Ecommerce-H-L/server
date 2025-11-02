import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface UnhandledException {
  name: string;
  message: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;
    const body =
      exception instanceof HttpException
        ? exception.getResponse()
        : {
            name: (exception as UnhandledException)?.name,
            message: (exception as UnhandledException)?.message,
          };

    req.log?.error({ err: exception }, 'Unhandled exception');

    res
      .status(status)
      .json(
        typeof body === 'string'
          ? { statusCode: status, message: body }
          : { statusCode: status, ...body },
      );
  }
}
