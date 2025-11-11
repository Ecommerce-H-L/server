import type { HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common';

export interface ExceptionDetail {
  field: string;
  message: string;
  value?: string | number;
}

export class BaseException extends HttpException {
  constructor(
    message: string,
    public readonly errorCode: string,
    statusCode: HttpStatus,
    public readonly details?: ExceptionDetail[],
  ) {
    super(
      {
        message,
        errorCode,
        details,
      },
      statusCode,
    );
  }
}
