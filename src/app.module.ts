import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/modules/common.module';
import { TokenService } from './common/services';
import { Env, validateEnv } from './config/env';
import { AuthModule } from './routes/auth/auth.module';
import { HealthController } from './routes/health/health.controller';
import { HealthModule } from './routes/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) => {
        const nodeEnv = config.get('NODE_ENV', { infer: true });
        const level = config.get('LOG_LEVEL', { infer: true });
        return {
          pinoHttp: {
            level,
            transport:
              nodeEnv === 'development'
                ? {
                    target: 'pino-pretty',
                    options: {
                      singleLine: true,
                      colorize: true,
                      translateTime: 'SYS:standard',
                      ignore: 'pid,hostname',
                    },
                  }
                : undefined,

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
        };
      },
    }),
    HealthModule,
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
    CommonModule,
    AuthModule,
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: 'APP_INTERCEPTOR',
      useClass: ClassSerializerInterceptor,
    },
    TokenService,
  ],
})
export class AppModule {}
