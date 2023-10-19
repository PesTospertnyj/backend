import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { expect, it } from '@jest/globals';
import { CreateUserDto } from '../../src/api/users/dto/create-user.dto';
import { UpdateUserDto } from '../../src/api/users/dto/update-user.dto';
import { UsersModule } from '../../src/api/users/users.module';

describe('[Feature] Users - /users', () => {
  let app: INestApplication;
  const user = {
    firstName: 'John',
    lastName: 'Buddy',
    password: 'Somestrongpasscode12746ahdf',
  };

  const expUser = {
    firstName: 'John',
    lastName: 'Buddy',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        TypeOrmModule.forRootAsync({
          useFactory: () => {
            return {
              type: 'postgres',
              host: 'localhost',
              port: 5433,
              username: 'postgres',
              password: 'root',
              database: 'backend',
              autoLoadEntities: true,
              synchronize: true,
            };
          },
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

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

    await app.init();
  });

  it('Create [POST /]', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/users')
      .send(user as CreateUserDto)
      .expect(HttpStatus.CREATED);

    const expectedUser = expect.objectContaining({
      ...expUser,
    });
    expect(body).toBeDefined();
    expect(body).toEqual(expectedUser);
    expect(body.password).toBeUndefined();
  });

  it('Get all [GET /]', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/users')
      .expect(HttpStatus.OK);

    const expectedUsers = expect.arrayContaining([
      expect.objectContaining({
        ...expUser,
      }),
    ]);
    expect(body).toBeDefined();
    expect(body).toEqual(expectedUsers);

    body.forEach((user: any) => {
      expect(user.password).toBeUndefined();
    });
  });

  it('Get one [GET /:id]', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/users/1')
      .expect(HttpStatus.OK);

    const expectedUser = expect.objectContaining({
      ...expUser,
    });
    expect(body).toBeDefined();
    expect(body).toEqual(expectedUser);
    expect(body.password).toBeUndefined();
  });

  it('Update [PATCH /:id]', async () => {
    const { body } = await request(app.getHttpServer())
      .patch('/users/1')
      .send(user as UpdateUserDto)
      .expect(HttpStatus.OK);

    const expectedUser = expect.objectContaining({
      ...expUser,
    });

    console.log('body', body);
    console.log('expectedUser', expectedUser);
    expect(body).toBeDefined();
    expect(body).toEqual(expectedUser);
    expect(body.password).toBeUndefined();
  });

  it('Delete [DELETE /:id]', () => {
    return request(app.getHttpServer())
      .delete('/users/1')
      .expect(HttpStatus.OK);
  });

  afterAll(async () => {
    await app.close();
  });
});
