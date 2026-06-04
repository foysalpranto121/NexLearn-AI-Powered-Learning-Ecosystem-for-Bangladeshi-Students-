import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const appOrigin = process.env.APP_ORIGIN || 'http://localhost:3000';
  app.enableCors({
    origin: appOrigin,
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`NexLearn backend running on: http://localhost:${port}/api/v1`);
}
bootstrap();

