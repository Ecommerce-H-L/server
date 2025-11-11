import type { ConfigService } from '@nestjs/config';
import type { Options } from 'pino-http';

import type { Env } from '@/config/env';

export function createLoggerOptions(
  configService: ConfigService<Env, true>,
): Options {
  const level = configService.get('LOG_LEVEL', { infer: true }) || 'info';
  const isDevelopment =
    configService.get('NODE_ENV', { infer: true }) !== 'production';

  return {
    level,
    autoLogging: false,
    transport: isDevelopment
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            singleLine: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname,req',
          },
        }
      : undefined,
  };
}
