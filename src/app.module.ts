import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { Logger, LoggerModule } from 'nestjs-pino';
import { ZodSerializerInterceptor } from 'nestjs-zod';

import { createLoggerOptions } from '@/utils';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Env, validateEnv } from './config/env';
import { AuthModule } from './routes/auth';
import { HealthController, HealthModule } from './routes/health';
import { UserModule } from './routes/user';
import {
  AllExceptionsFilter,
  CustomZodValidationPipe,
  LoggerService,
  SharedModule,
  TokenService,
} from './shared';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Env, true>) => ({
        pinoHttp: {
          ...createLoggerOptions(configService),
          genReqId: (req) =>
            (req.headers['x-request-id'] as string) || crypto.randomUUID(),
          redact: {
            paths: [
              'req.headers.authorization',
              'req.body.password',
              'res.body.token',
            ],
            remove: true,
          },
        },
      }),
    }),
    HealthModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) => [
        {
          ttl: config.get('THROTTLE_TTL', { infer: true }),
          limit: config.get('THROTTLE_LIMIT', { infer: true }),
        },
      ],
    }),
    SharedModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: CustomZodValidationPipe,
    },
    {
      provide: APP_FILTER,
      useFactory: (logger: LoggerService) => new AllExceptionsFilter(logger),
      inject: [Logger],
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    TokenService,
  ],
})
export class AppModule {}
