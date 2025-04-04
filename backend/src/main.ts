import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { env } from '#utils';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableVersioning();

  app.useStaticAssets(
    path.join(process.cwd(), '@Upload', env.PUBLIC_IMAGES_BUCKET_NAME),
    {
      prefix: '/static/assets',
    },
  );

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  const PORT = env.BACKEND_PORT || 3000;
  await app.listen(PORT, () => {
    console.log(`Server is running at ${env.BACKEND_BASE_URL}:${PORT}`);
  });
}
bootstrap();
