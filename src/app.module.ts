import { Module } from '@nestjs/common';
import { UsersModule } from './api/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CoffeesModule } from './api/coffees/coffees.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('POSTGRES_HOST'),
        port: +config.get('POSTGRES_PORT'),
        username: config.get('POSTGRES_USER'),
        password: config.get('POSTGRES_PASSWORD'),
        database: config.get('POSTGRES_DB'),
        entities: ['dist/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
    UsersModule,
    CoffeesModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
