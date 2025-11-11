import type { ConfigService } from '@nestjs/config';
import type { LoggerOptions } from 'pino';

import type { Env } from '@/config/env';

export function createLoggerOptions(
  configService: ConfigService<Env, true>,
): LoggerOptions {
  const level = configService.get('LOG_LEVEL', { infer: true }) || 'info';
  const isDevelopment =
    configService.get('NODE_ENV', { infer: true }) !== 'production';

  return {
    level,
    transport: isDevelopment
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            singleLine: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
  };
}
