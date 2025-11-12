import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';

import { AccessTokenGuard, ApiKeyGuard, AuthenticationGuard } from '../guards';
import { HashingService, PrismaService, TokenService } from '../services';

const services = [
  PrismaService,
  HashingService,
  TokenService,
  JwtService,
  AccessTokenGuard,
  ApiKeyGuard,
];

@Global()
@Module({
  providers: [
    ...services,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
  ],
  exports: services,
  imports: [JwtModule],
})
export class CommonModule {}
