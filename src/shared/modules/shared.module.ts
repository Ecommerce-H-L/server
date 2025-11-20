import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';

import { AccessTokenGuard, ApiKeyGuard, AuthenticationGuard } from '../guards';
import { SharedUserRepository } from '../repositories';
import {
  EmailService,
  HashingService,
  PrismaService,
  TokenService,
} from '../services';
import { LoggerService } from '../services/logger.service';

const services = [
  PrismaService,
  HashingService,
  TokenService,
  JwtService,
  AccessTokenGuard,
  ApiKeyGuard,
  LoggerService,
  EmailService,
  SharedUserRepository,
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
export class SharedModule {}
