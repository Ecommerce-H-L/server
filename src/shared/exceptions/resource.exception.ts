import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '@/shared/constants';

import type { ExceptionDetail } from './base.exception';
import { BaseException } from './base.exception';

/**
 * Base class for resource-related exceptions
 */
export class ResourceException extends BaseException {
  constructor(
    message: string,
    errorCode: ErrorCode,
    statusCode: HttpStatus,
    details?: ExceptionDetail[],
  ) {
    super(message, errorCode, statusCode, details);
  }
}

export class ResourceNotFoundException extends ResourceException {
  constructor(resource: string, identifier: string | number) {
    super(
      `${resource} with id ${identifier} not found`,
      ErrorCode.USER_NOT_FOUND,
      HttpStatus.NOT_FOUND,
    );
  }
}

export class UserNotFoundException extends ResourceException {
  constructor(identifier: string | number) {
    super(
      `User with id ${identifier} not found`,
      ErrorCode.USER_NOT_FOUND,
      HttpStatus.NOT_FOUND,
    );
  }
}

export class DuplicateResourceException extends ResourceException {
  constructor(resource: string, field: string, value: string | number) {
    super(
      `${resource} with ${field}: '${value}' already exists`,
      ErrorCode.RESOURCE_ALREADY_EXISTS,
      HttpStatus.CONFLICT,
      [{ field, message: 'already exists', value }],
    );
  }
}

export class EmailAlreadyExistsException extends ResourceException {
  constructor(email?: string) {
    super(
      'An account with this email already exists',
      ErrorCode.EMAIL_ALREADY_EXISTS,
      HttpStatus.CONFLICT,
      email
        ? [{ field: 'email', message: 'already exists', value: email }]
        : undefined,
    );
  }
}

export class ResourceHasDependenciesException extends ResourceException {
  constructor(resource: string, dependencies: string[]) {
    super(
      `Cannot delete ${resource} with existing ${dependencies.join(', ')}`,
      ErrorCode.RESOURCE_HAS_DEPENDENCIES,
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}

export class CannotDeleteSelfException extends ResourceException {
  constructor() {
    super(
      'You cannot delete your own account',
      ErrorCode.CANNOT_DELETE_SELF,
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}

export class CannotUpdateSelfRoleException extends ResourceException {
  constructor() {
    super(
      'You cannot change your own role',
      ErrorCode.CANNOT_UPDATE_SELF_ROLE,
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
