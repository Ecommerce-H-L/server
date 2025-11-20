import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User, VerificationCodeType } from '@prisma/client';
import dayjs from 'dayjs';
import { CreateEmailResponse } from 'resend';

import { Env } from '@/config/env';
import { ErrorCode, SharedUserRepository, TokenPayload } from '@/shared';
import {
  AuthException,
  EmailAlreadyExistsException,
  FailedToSendOTPException,
  InvalidCredentialsException,
  InvalidOTPException,
  OTPExpiredException,
  ResourceNotFoundException,
  TokenExpiredException,
  TokenInvalidException,
  TokenRevokedException,
} from '@/shared/exceptions';
import {
  EmailService,
  HashingService,
  LoggerService,
  TokenService,
} from '@/shared/services';
import { isNotFoundPrismaError, isUniqueConstraintPrismaError } from '@/utils';

import {
  LoginBodyDTO,
  LoginResponseDTO,
  RegisterBodyDTO,
  ResetPasswordBody,
} from './auth.dto';
import { generateOTP } from './auth.helper';
import { SendOTPBodyType } from './auth.model';
import { AuthRepo } from './auth.repo';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly tokenService: TokenService,
    private readonly logger: LoggerService,
    private readonly configService: ConfigService<Env, true>,
    private readonly emailService: EmailService,
    private readonly authRepo: AuthRepo,
    private readonly sharedUserRepo: SharedUserRepository,
  ) {}

  async register(body: RegisterBodyDTO): Promise<Omit<User, 'passwordHash'>> {
    try {
      await this.validateVerificationCode({
        email: body.email,
        type: VerificationCodeType.REGISTER,
        code: body.code,
      });
      const { password } = body;
      const hashedPassword = await this.hashingService.hash(password);
      const [user] = await Promise.all([
        this.sharedUserRepo.create({
          email: body.email,
          firstName: body.firstName,
          lastName: body.lastName,
          passwordHash: hashedPassword,
          role: body.role,
        }),
        this.authRepo.deleteVerificationCode({
          email_type: {
            email: body.email,
            type: VerificationCodeType.REGISTER,
          },
        }),
      ]);
      this.logger.log('User registered successfully', 'AuthService');
      return user;
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        this.logger.error('Email already exists', error.message, 'AuthService');
        throw new EmailAlreadyExistsException(body.email);
      }
      this.logger.error(
        'Error during registration',
        error instanceof Error ? error.message : String(error),
        'AuthService',
      );
      throw error;
    }
  }

  async login(body: LoginBodyDTO): Promise<LoginResponseDTO> {
    const user = await this.authRepo.findUserByEmail(body.email);
    if (!user) {
      this.logger.warn('Invalid credentials provided', 'AuthService');
      throw new InvalidCredentialsException();
    }
    const isValidPassword = await this.hashingService.compare(
      body.password,
      user.passwordHash,
    );
    if (!isValidPassword) {
      this.logger.warn('Invalid credentials provided', 'AuthService');
      throw new InvalidCredentialsException();
    }
    const tokens = await this.generateTokens({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
    this.logger.log('User logged in successfully', 'AuthService');
    return tokens;
  }

  async generateTokens(payload: {
    user: TokenPayload['user'];
  }): Promise<LoginResponseDTO> {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken(payload),
      this.tokenService.signRefreshToken(payload),
    ]);

    const decodedRefreshToken = await this.tokenService.verifyRefreshToken<{
      exp: number;
    }>(refreshToken);

    await this.authRepo.createRefreshToken({
      token: refreshToken,
      userId: payload.user.id,
      expiredAt: dayjs.unix(decodedRefreshToken.exp ?? 0).toDate(),
    });

    this.logger.debug('Tokens generated successfully', 'AuthService');
    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshToken: string): Promise<LoginResponseDTO> {
    try {
      await this.authRepo.findRefreshToken({ token: refreshToken });

      const decodedToken =
        await this.tokenService.verifyRefreshToken<TokenPayload>(refreshToken);

      if (dayjs().isAfter(dayjs.unix(decodedToken.exp))) {
        this.logger.warn('Refresh token expired', 'AuthService');
        throw new TokenExpiredException('refresh');
      }

      const tokens = await this.generateTokens({
        user: decodedToken.user,
      });

      await this.authRepo.deleteRefreshToken({ token: refreshToken });

      this.logger.log('Tokens refreshed successfully', 'AuthService');
      return tokens;
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        this.logger.warn('Refresh token revoked', 'AuthService');
        throw new TokenRevokedException();
      }
      this.logger.error(
        'Error during token refresh',
        error instanceof Error ? error.message : String(error),
        'AuthService',
      );
      throw new TokenInvalidException('Fail to refresh tokens');
    }
  }

  async logout(refreshToken: string) {
    try {
      const stored = await this.authRepo.findRefreshToken({
        token: refreshToken,
      });
      if (!stored) {
        this.logger.warn('Refresh token not found', 'AuthService');
        throw new TokenRevokedException();
      }

      try {
        await this.tokenService.verifyRefreshToken(refreshToken);
      } catch {
        this.logger.warn('Invalid refresh token during logout', 'AuthService');
        throw new TokenInvalidException('Refresh token is invalid or expired');
      }

      await this.authRepo.deleteRefreshToken({ token: refreshToken });
      this.logger.log('User logged out successfully', 'AuthService');
      return { message: 'Logout successfully' };
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        this.logger.warn('Refresh token revoked during logout', 'AuthService');
        throw new TokenRevokedException();
      }
      if (error instanceof AuthException) {
        throw error;
      }
      this.logger.error(
        'Unknown error during logout',
        error instanceof Error ? error.message : 'Unknown error',
        'AuthService',
      );
      throw new AuthException(
        'Logout failed due to an unknown error',
        ErrorCode.LOGOUT_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async resetPassword(body: ResetPasswordBody) {
    const { email, code, newPassword } = body;
    const user = await this.sharedUserRepo.findUnique({
      email,
    });
    if (!user) {
      throw new ResourceNotFoundException('Email', email);
    }
    await this.validateVerificationCode({
      email,
      type: VerificationCodeType.RESET_PASSWORD,
      code,
    });
    const hashedPassword = await this.hashingService.hash(newPassword);
    await Promise.all([
      this.sharedUserRepo.update(
        {
          passwordHash: hashedPassword,
        },
        {
          where: { id: user.id },
        },
      ),
      this.authRepo.deleteVerificationCode({
        email_type: {
          email: body.email,
          type: VerificationCodeType.RESET_PASSWORD,
        },
      }),
    ]);
    return { message: 'Update password successfully' };
  }

  async sendOtp(body: SendOTPBodyType) {
    const user = await this.authRepo.findUserByEmail(body.email);

    const code = generateOTP();

    const otpTypeMapping: Record<
      SendOTPBodyType['type'],
      {
        shouldExist: boolean;
        exception: Error;
        serviceCall: (args: {
          email: string;
          otpCode: string;
        }) => Promise<CreateEmailResponse>;
      }
    > = {
      REGISTER: {
        shouldExist: !!user,
        exception: new EmailAlreadyExistsException(body.email),
        serviceCall: (args: { email: string; otpCode: string }) =>
          this.emailService.sendEmailVerificationOtp(args),
      },
      RESET_PASSWORD: {
        shouldExist: !user,
        exception: new ResourceNotFoundException('User', body.email),
        serviceCall: (args: { email: string; otpCode: string }) =>
          this.emailService.sendPasswordResetOtp(args),
      },
    };
    if (otpTypeMapping[body.type].shouldExist) {
      throw otpTypeMapping[body.type].exception;
    }

    if (body.type === 'RESET_PASSWORD' && !user) {
      throw new ResourceNotFoundException('User', body.email);
    }

    await this.authRepo.createVerificationCode({
      email: body.email,
      type: body.type,
      code,
      expiresAt: dayjs()
        .add(this.configService.get('OTP_EXPIRES_IN'), 'millisecond')
        .toISOString(),
    });

    this.logger.log(`OTP generated for ${body.email}`, 'AuthService');

    const { error } = await otpTypeMapping[body.type].serviceCall({
      email: body.email,
      otpCode: code,
    });

    if (error) {
      this.logger.error(
        'Failed to send OTP email',
        error.message,
        'AuthService',
      );
      throw new FailedToSendOTPException();
    }
    return { message: 'OTP sent successfully' };
  }

  async validateVerificationCode({
    email,
    type,
    code,
  }: {
    email: string;
    type: VerificationCodeType;
    code: string;
  }) {
    const vevificationCode = await this.authRepo.findUniqueVerificationCode({
      email_type: {
        email,
        type,
      },
    });
    if (!vevificationCode || vevificationCode.code !== code) {
      throw new InvalidOTPException();
    }
    if (new Date(vevificationCode.expiresAt) < new Date()) {
      throw new OTPExpiredException();
    }
    return vevificationCode;
  }
}
