import { Logger, Module, ValidationPipe } from '@nestjs/common';
import { UsersModule } from './api/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CoffeesModule } from './api/coffees/coffees.module';
import { CoffeeRatingModule } from './api/coffee-rating/coffee-rating.module';
import appConfig from './app.config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { CommonModule } from './common/common.module';
import { TimeoutInterceptor } from './common/interceptors/timeout/timeout.interceptor';
import { validateConfig } from './config/validate';
import { AppController } from './app.controller';
import { HttpExceptionExceptionFilter } from './common/filters/http-exception.filter';
import { seconds, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { winstonConfig } from './logger/winston.config';
import { CarsModule } from './api/cars/cars.module';
import { MinioModule } from './storage/minio/minio.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: +configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: ['dist/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: seconds(configService.get('THROTTLE_TTL')),
          limit: configService.get('THROTTLE_LIMIT'),
        },
      ],
    }),
    ConfigModule.forRoot({
      load: [appConfig],
      validate: validateConfig,
      cache: true,
    }),
    UsersModule,
    CoffeesModule,
    CoffeeRatingModule,
    CommonModule,
    CarsModule,
    MinioModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useFactory: () => {
        return new ValidationPipe({
          whitelist: true,
          transform: true, // automatically transform payloads to DTO instances.
          forbidNonWhitelisted: true, // throw an error if a non-whitelisted property is present on the DTO.
          transformOptions: {
            enableImplicitConversion: true, // automatically transform primitive types like string to number.
          },
        });
      },
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    { provide: APP_INTERCEPTOR, useClass: TimeoutInterceptor },
    { provide: APP_FILTER, useClass: HttpExceptionExceptionFilter },
    {
      provide: Logger,
      useValue: winstonConfig,
    },
  ],
})
export class AppModule {}
