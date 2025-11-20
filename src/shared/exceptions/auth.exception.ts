import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '@/shared/constants';

import { BaseException } from './base.exception';

export class AuthException extends BaseException {
  constructor(message: string, errorCode: ErrorCode, statusCode: HttpStatus) {
    super(message, errorCode, statusCode);
  }
}

export class InvalidCredentialsException extends AuthException {
  constructor() {
    super(
      'Invalid email or password',
      ErrorCode.INVALID_CREDENTIALS,
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class UnauthorizedException extends AuthException {
  constructor(message: string = 'Unauthorized access') {
    super(message, ErrorCode.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
  }
}

export class TokenExpiredException extends AuthException {
  constructor(tokenType: 'access' | 'refresh' = 'access') {
    super(
      `${tokenType === 'access' ? 'Access' : 'Refresh'} token has expired`,
      ErrorCode.TOKEN_EXPIRED,
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class TokenInvalidException extends AuthException {
  constructor(reason?: string) {
    super(
      reason || 'Invalid authentication token',
      ErrorCode.TOKEN_INVALID,
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class TokenRevokedException extends AuthException {
  constructor() {
    super(
      'Token has been revoked. All sessions have been logged out.',
      ErrorCode.TOKEN_REVOKED,
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class TokenReuseDetectedException extends AuthException {
  constructor() {
    super(
      'Token reuse detected. All sessions have been revoked for security.',
      ErrorCode.TOKEN_REUSE_DETECTED,
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class AccountDisabledException extends AuthException {
  constructor() {
    super(
      'Your account has been disabled',
      ErrorCode.ACCOUNT_DISABLED,
      HttpStatus.FORBIDDEN,
    );
  }
}

export class EmailNotVerifiedException extends AuthException {
  constructor() {
    super(
      'Please verify your email address',
      ErrorCode.EMAIL_NOT_VERIFIED,
      HttpStatus.FORBIDDEN,
    );
  }
}

export class InsufficientPermissionsException extends AuthException {
  constructor(requiredRole?: string) {
    super(
      requiredRole
        ? `This action requires ${requiredRole} role`
        : 'You do not have permission to perform this action',
      ErrorCode.INSUFFICIENT_PERMISSIONS,
      HttpStatus.FORBIDDEN,
    );
  }
}

export class TooManyAttemptsException extends AuthException {
  constructor() {
    super(
      'Too many attempts. Please try again later.',
      ErrorCode.TOO_MANY_ATTEMPTS,
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}

export class FailedToSendOTPException extends AuthException {
  constructor() {
    super(
      'Failed to send the OTP. Please try again later.',
      ErrorCode.FAILED_TO_SEND_OTP,
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class InvalidOTPException extends AuthException {
  constructor() {
    super(
      'The provided OTP is invalid.',
      ErrorCode.INVALID_OTP,
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class OTPExpiredException extends AuthException {
  constructor() {
    super(
      'The OTP has expired.',
      ErrorCode.OTP_EXPIRED,
      HttpStatus.BAD_REQUEST,
    );
  }
}
