import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '@/common/constants';

import type { ExceptionDetail } from './base.exception';
import { BaseException } from './base.exception';

/**
 * Base class for validation exceptions
 */
export class ValidationException extends BaseException {
  constructor(message = 'Validation failed', details?: ExceptionDetail[]) {
    super(message, ErrorCode.VALIDATION_ERROR, HttpStatus.BAD_REQUEST, details);
  }
}

export class InvalidFieldValueException extends ValidationException {
  constructor(field: string, reason: string, value?: string | number) {
    super('Invalid field value', [{ field, message: reason, value }]);
  }
}

export class MissingRequiredFieldException extends ValidationException {
  constructor(fields: string[]) {
    super(
      'Missing required fields',
      fields.map((field) => ({
        field,
        message: 'is required',
        constraint: 'required',
      })),
    );
  }
}

export class InvalidFormatException extends ValidationException {
  constructor(field: string, expectedFormat: string, value?: string | number) {
    super('Invalid format', [
      {
        field,
        message: `must be in format: ${expectedFormat}`,
        value,
      },
    ]);
  }
}

export class InvalidEmailFormatException extends ValidationException {
  constructor(email?: string) {
    super('Invalid email format', [
      {
        field: 'email',
        message: 'must be a valid email address',
        value: email,
      },
    ]);
  }
}

export class ValueOutOfRangeException extends ValidationException {
  constructor(field: string, min: number, max: number, value?: number) {
    super('Value out of range', [
      {
        field,
        message: `must be between ${min} and ${max}`,
        value,
      },
    ]);
  }
}

export class InvalidLengthException extends ValidationException {
  constructor(
    field: string,
    minLength: number,
    maxLength: number,
    actualLength?: number,
  ) {
    super('Invalid length', [
      {
        field,
        message: `must be between ${minLength} and ${maxLength} characters`,
        value: `${actualLength ?? 'unknown'} characters`,
      },
    ]);
  }
}
