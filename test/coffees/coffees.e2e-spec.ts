import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CoffeesModule } from '../../src/api/coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateCoffeeDto } from '../../src/api/coffees/dto/create-coffee.dto';
import * as request from 'supertest';
import { expect, it } from '@jest/globals';
import { UpdateCoffeeDto } from '../../src/api/coffees/dto/update-coffee.dto';

describe('[Feature] Coffees - /coffees', () => {
  let app: INestApplication;
  const coffee = {
    name: 'Shipwreck Roast',
    brand: 'Buddy Brew',
    flavors: ['chocolate', 'vanilla'],
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CoffeesModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5433,
          username: 'postgres',
          password: 'root',
          database: 'backend',
          autoLoadEntities: true,
          synchronize: true,
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
      .post('/coffees')
      .send(coffee as CreateCoffeeDto)
      .expect(HttpStatus.CREATED);

    const expectedCoffee = expect.objectContaining({
      ...coffee,
      flavors: expect.arrayContaining(
        coffee.flavors.map((name) => expect.objectContaining({ name })),
      ),
    });
    expect(body).toBeDefined();
    expect(body).toEqual(expectedCoffee);
  });

  it('Get all [GET /]', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/coffees')
      .expect(HttpStatus.OK);

    const expectedCoffees = expect.arrayContaining([
      expect.objectContaining({
        ...coffee,
        flavors: expect.arrayContaining(
          coffee.flavors.map((name) => expect.objectContaining({ name })),
        ),
      }),
    ]);
    expect(body).toBeDefined();
    expect(body).toEqual(expectedCoffees);
  });

  it('Get one [GET /:id]', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/coffees/1')
      .expect(HttpStatus.OK);

    const expectedCoffee = expect.objectContaining({
      ...coffee,
      flavors: expect.arrayContaining(
        coffee.flavors.map((name) => expect.objectContaining({ name })),
      ),
    });
    expect(body).toBeDefined();
    expect(body).toEqual(expectedCoffee);
  });

  it('Update [PATCH /:id]', async () => {
    const { body } = await request(app.getHttpServer())
      .patch('/coffees/1')
      .send(coffee as UpdateCoffeeDto)
      .expect(HttpStatus.OK);

    const expectedCoffee = expect.objectContaining({
      ...coffee,
      flavors: expect.arrayContaining(
        coffee.flavors.map((name) => expect.objectContaining({ name })),
      ),
    });
    expect(body).toBeDefined();
    expect(body).toEqual(expectedCoffee);
  });

  it('Delete [DELETE /:id]', () => {
    return request(app.getHttpServer())
      .delete('/coffees/1')
      .expect(HttpStatus.OK);
  });

  afterAll(async () => {
    await app.close();
  });
});
