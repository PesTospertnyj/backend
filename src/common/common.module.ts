import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ApiKeyGuard } from './guards/api-key.guard';
import { ConfigModule } from '@nestjs/config';
import { TimeoutInterceptor } from './interceptors/timeout/timeout.interceptor';
import { LoggingMiddleware } from './middlewares/logging/logging.middleware';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: ApiKeyGuard },
    { provide: APP_INTERCEPTOR, useClass: TimeoutInterceptor },
  ],
  exports: [],
})
export class CommonModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
