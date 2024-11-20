import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { env } from '#utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(env.BACKEND_PORT ?? 3000);
}
bootstrap();
