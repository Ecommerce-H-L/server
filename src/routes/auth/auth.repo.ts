import { Injectable } from '@nestjs/common';
import {
  Prisma,
  RefreshToken,
  User,
  VerificationCode,
  VerificationCodeType,
} from '@prisma/client';

import { PrismaService } from '@/shared';

@Injectable()
export class AuthRepo {
  constructor(private readonly prismaService: PrismaService) {}

  createVerificationCode(
    payload: Prisma.VerificationCodeCreateInput,
  ): Promise<VerificationCode> {
    return this.prismaService.verificationCode.upsert({
      where: {
        email_type: {
          email: payload.email,
          type: payload.type,
        },
      },
      create: payload,
      update: {
        code: payload.code,
        expiresAt: payload.expiresAt,
      },
    });
  }

  findUniqueVerificationCode(
    uniqueValue:
      | { id: number }
      | {
          email_type: {
            email: string;
            type: VerificationCodeType;
          };
        },
  ) {
    return this.prismaService.verificationCode.findUnique({
      where: uniqueValue,
    });
  }

  deleteVerificationCode(
    uniqueValue:
      | { id: number }
      | {
          email_type: {
            email: string;
            type: VerificationCodeType;
          };
        },
  ): Promise<VerificationCode> {
    return this.prismaService.verificationCode.delete({
      where: uniqueValue,
    });
  }

  findUserByEmail(email: User['email']): Promise<User | null> {
    return this.prismaService.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    });
  }

  createRefreshToken(data: Prisma.RefreshTokenUncheckedCreateInput) {
    return this.prismaService.refreshToken.create({ data });
  }

  findRefreshToken(where: {
    token: RefreshToken['token'];
  }): Promise<RefreshToken | null> {
    return this.prismaService.refreshToken.findUnique({ where });
  }

  deleteRefreshToken(where: {
    token: RefreshToken['token'];
  }): Promise<RefreshToken> {
    return this.prismaService.refreshToken.delete({ where });
  }
}
