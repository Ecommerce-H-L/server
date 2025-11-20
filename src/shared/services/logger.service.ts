import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import pino, { Logger as PinoLogger } from 'pino';

import { Env } from '@/config/env';
import { createLoggerOptions } from '@/utils/logger-config.util';

@Injectable()
export class LoggerService extends Logger {
  private readonly logger: PinoLogger;

  constructor(private readonly configService: ConfigService<Env, true>) {
    super();
    const loggerOptions = createLoggerOptions(configService);
    this.logger = pino(loggerOptions);
  }

  override log(message: string, context?: string): void {
    this.logger.info({ context }, message);
  }

  override error(message: string, trace?: string, context?: string): void {
    this.logger.error({ context, trace }, message);
  }

  override warn(message: string, context?: string): void {
    this.logger.warn({ context }, message);
  }

  override debug(message: string, context?: string): void {
    this.logger.debug({ context }, message);
  }

  override verbose(message: string, context?: string): void {
    this.logger.trace({ context }, message);
  }
}
