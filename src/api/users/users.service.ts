import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { hashPassword } from '../../common/crypto/hash-password';
import { plainToClass, plainToInstance } from 'class-transformer';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const password = await hashPassword(createUserDto.password);

    const user = await this.usersRepository.save({
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      password: password,
    });

    return plainToClass(UserDto, user, { excludeExtraneousValues: true });
  }

  async findAll() {
    const users = await this.usersRepository.find();

    if (users.length == 0) {
      throw new NotFoundException(`No users found`);
    }

    return plainToInstance(UserDto, users, { excludeExtraneousValues: true });
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    return plainToClass(UserDto, user, { excludeExtraneousValues: true });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    let user = await this.usersRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    if (user.password) {
      user.password = await hashPassword(updateUserDto.password);
    }

    user = await this.usersRepository.save(
      this.usersRepository.merge(user, updateUserDto),
    );

    return plainToClass(UserDto, user, { excludeExtraneousValues: true });
  }

  remove(id: number) {
    return this.usersRepository.delete(id);
  }
}
