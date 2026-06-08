import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const allowedOrigins = (
    process.env.APP_ORIGIN ||
    'http://localhost:3000,http://localhost:5500,http://127.0.0.1:5500,http://localhost:8080'
  ).split(',');

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
  });

  const frontendPath = join(__dirname, '..', '..', 'frontend');
  app.useStaticAssets(frontendPath, { index: ['index.html'] });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`NexLearn app running on: http://localhost:${port}`);
  console.log(`API available at: http://localhost:${port}/api/v1`);
}
bootstrap();

