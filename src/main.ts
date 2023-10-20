import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { winstonConfig } from './logger/winston.config';

async function bootstrap() {
  const logger = new Logger('bootstrap');

  const app = await NestFactory.create(AppModule, {
    logger: winstonConfig,
  });
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

  app.enableCors();

  await app.listen(port);
}

bootstrap();
