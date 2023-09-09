import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true, // automatically transform payloads to DTO instances.
      forbidNonWhitelisted: true, // throw an error if a non-whitelisted property is present on the DTO.
      transformOptions: {
        enableImplicitConversion: true, // automatically transform primitive types like string to number.
      },
    }),
  );
  await app.listen(3000);
}

bootstrap();
