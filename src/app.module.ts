import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';

import { createLoggerOptions } from '@/utils';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Env, validateEnv } from './config/env';
import { AuthModule } from './routes/auth';
import { HealthController, HealthModule } from './routes/health';
import { UserModule } from './routes/user';
import { SharedModule, TokenService } from './shared';

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
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    TokenService,
  ],
})
export class AppModule {}
