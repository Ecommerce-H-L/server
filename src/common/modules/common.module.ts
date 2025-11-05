import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';

import { AccessTokenGuard } from '../guards';
import { ApiKeyGuard } from '../guards/api-key.guard';
import { AuthenticationGuard } from '../guards/authentication.guard';
import { HashingService, PrismaService } from '../services';
import { TokenService } from '../services/token.service';

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
