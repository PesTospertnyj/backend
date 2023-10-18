import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { HttpExceptionExceptionFilter } from './common/filters/http-exception.filter';
import { WrapResponseInterceptor } from './common/interceptors/wrap-response/wrap-response.interceptor';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('bootstrap');

  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionExceptionFilter());
  app.useGlobalInterceptors(new WrapResponseInterceptor());
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

  const options = new DocumentBuilder()
    .setTitle('Backend API')
    .setDescription('Backend API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  const config = app.get(ConfigService);
  const port = parseInt(config.get('API_PORT'));

  logger.log(`Listening on port ${port}`);

  await app.listen(port);
}

bootstrap();
