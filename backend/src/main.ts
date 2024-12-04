import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { env } from '#utils';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { BUCKET_NAME } from './@metadata';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableVersioning();

  app.useStaticAssets(
    path.join(process.cwd(), '@Upload', BUCKET_NAME.ITEM_IMAGE_BUCKET),
    {
      prefix: '/static/assets',
    },
  );

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(env.BACKEND_PORT ?? 3000);
}
bootstrap();
