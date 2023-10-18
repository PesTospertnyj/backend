import { Module, ValidationPipe } from '@nestjs/common';
import { UsersModule } from './api/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CoffeesModule } from './api/coffees/coffees.module';
import { CoffeeRatingModule } from './api/coffee-rating/coffee-rating.module';
import appConfig from './app.config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { CommonModule } from './common/common.module';
import { TimeoutInterceptor } from './common/interceptors/timeout/timeout.interceptor';
import { validateConfig } from './config/validate';
import { AppController } from './app.controller';
import { HttpExceptionExceptionFilter } from './common/filters/http-exception.filter';
import { WrapResponseInterceptor } from './common/interceptors/wrap-response/wrap-response.interceptor';

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
    ConfigModule.forRoot({
      load: [appConfig],
      validate: validateConfig,
    }),
    UsersModule,
    CoffeesModule,
    CoffeeRatingModule,
    CommonModule,
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
    { provide: APP_INTERCEPTOR, useClass: TimeoutInterceptor },
    { provide: APP_FILTER, useClass: HttpExceptionExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: WrapResponseInterceptor },
  ],
})
export class AppModule {}
