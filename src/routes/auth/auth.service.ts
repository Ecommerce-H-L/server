import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import dayjs from 'dayjs';

import { TokenPayload } from '@/common';
import { HashingService, PrismaService, TokenService } from '@/common/services';
import { isNotFoundPrismaError, isUniqueConstraintPrismaError } from '@/utils';

import { LoginBodyDTO, LoginResponseDTO, RegisterBodyDTO } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly prismaService: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async register(body: RegisterBodyDTO): Promise<User> {
    try {
      const { password, ...userData } = body;
      const hashedPassword = await this.hashingService.hash(password);
      const user = await this.prismaService.user.create({
        data: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role,
          email: userData.email,
          passwordHash: hashedPassword,
        },
      });
      return user;
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw new UnprocessableEntityException([
          {
            field: 'email',
            message: 'Email is already in use',
          },
        ]);
      }
      throw error;
    }
  }

  async login(body: LoginBodyDTO): Promise<LoginResponseDTO> {
    const user = await this.prismaService.user.findUnique({
      where: { email: body.email },
    });
    if (!user) {
      throw new UnauthorizedException([
        {
          field: 'email',
          message: 'Email does not exist',
        },
      ]);
    }
    const isValidPassword = await this.hashingService.compare(
      body.password,
      user.passwordHash,
    );
    if (!isValidPassword) {
      throw new UnprocessableEntityException([
        {
          field: 'password',
          message: 'Password is incorrect',
        },
      ]);
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

    await this.prismaService.refreshToken.create({
      data: {
        token: refreshToken,
        userId: payload.user.id,
        expiredAt: dayjs.unix(decodedRefreshToken.exp ?? 0).toISOString(),
      },
    });

    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshToken: string): Promise<LoginResponseDTO> {
    try {
      await this.prismaService.refreshToken.findUnique({
        where: { token: refreshToken },
      });

      const decodedToken =
        await this.tokenService.verifyRefreshToken<TokenPayload>(refreshToken);

      if (dayjs().isAfter(dayjs.unix(decodedToken.exp))) {
        throw new UnauthorizedException('Refresh token has expired');
      }

      const tokens = await this.generateTokens({
        user: decodedToken.user,
      });

      await this.prismaService.refreshToken.delete({
        where: { token: refreshToken },
      });

      return tokens;
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new UnauthorizedException('Refresh token has been revoked');
      }
      throw new UnauthorizedException(error);
    }
  }

  async logout(refreshToken: string) {
    try {
      await this.tokenService.verifyRefreshToken(refreshToken);
      await this.prismaService.refreshToken.delete({
        where: {
          token: refreshToken,
        },
      });

      return { message: 'Logout successfully' };
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new UnauthorizedException('Refresh token has been revoked');
      }
      throw new UnauthorizedException();
    }
  }
}
