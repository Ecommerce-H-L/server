import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { ValidationError } from 'class-validator';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';
import type { Env } from './config/env';
import { ValidationException } from './shared/exceptions';
import { AllExceptionsFilter } from './shared/filters';
import { TransformInterceptor } from './shared/interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('My API')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const doc = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/api/docs', app, doc);

  const config = app.get<ConfigService<Env, true>>(ConfigService);
  const port = config.get('PORT', { infer: true });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: false,
      exceptionFactory: (errors: ValidationError[]) => {
        const details = errors.flatMap((e) => {
          const constraints = e.constraints ? Object.values(e.constraints) : [];
          return constraints.length
            ? constraints.map((msg) => ({ field: e.property, message: msg }))
            : [{ field: e.property, message: 'Invalid value' }];
        });
        return new ValidationException('Validation failed', details);
      },
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter(app.get(Logger)));

  app.useGlobalInterceptors(new TransformInterceptor());

  app.use(helmet());
  app.enableCors({ origin: true, credentials: true });

  await app.listen(port);
}
bootstrap();
