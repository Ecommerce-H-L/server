import { writeFileSync } from 'node:fs';

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from '../src/app.module';
(async () => {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('My API')
    .setVersion('1.0.0')
    .build();
  const doc = SwaggerModule.createDocument(app, config);
  writeFileSync('swagger.json', JSON.stringify(doc, null, 2));
  await app.close();
})();
