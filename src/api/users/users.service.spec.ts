import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DataSource, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  merge: jest.fn(),
  save: jest.fn(),
});

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: DataSource,
          useValue: {},
        },
        {
          provide: getRepositoryToken(User),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<MockRepository>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    describe('when coffee with id exists', () => {
      it('should return the coffee object', async () => {
        const UserId = 1;
        const expectedUser = {};

        usersRepository.findOne.mockReturnValue(expectedUser);
        const coffee = await service.findOne(UserId);
        expect(coffee).toEqual(expectedUser as User);
      });
    });
  });

  describe('update', () => {
    describe('when user with id exists', () => {
      it('should return the user object', async () => {
        const userId = 1;
        const dto: UpdateUserDto = {
          firstName: 'test',
        };
        const expectedUser = {};

        usersRepository.findOne.mockReturnValue(expectedUser);
        usersRepository.save.mockReturnValue(expectedUser);
        const coffee = await service.update(userId, dto);
        expect(coffee).toEqual(expectedUser as User);
      });
    });
    describe('otherwise', () => {
      it('should throw the NotFoundException', async () => {
        const userId = 1;
        const dto: UpdateUserDto = {
          firstName: 'test',
        };
        usersRepository.findOne.mockReturnValue(undefined);

        try {
          await service.update(userId, dto);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`User #${userId} not found`);
        }
      });
    });
  });
});
