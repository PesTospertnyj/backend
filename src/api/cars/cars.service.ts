import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { MinioService } from '../../storage/minio/minio.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from './entities/car.entity';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import * as process from 'process';

@Injectable()
export class CarsService {
  private readonly logger: Logger = new Logger(CarsService.name);
  private readonly env: string;
  private readonly region: string;
  private readonly endpoint: string;
  private readonly port: number;

  constructor(
    private readonly minioService: MinioService,
    private readonly configService: ConfigService,
    @InjectRepository(Car) private carsRepository: Repository<Car>,
  ) {
    this.env = this.configService.get<string>(process.env.NODE_ENV);
    this.region = this.configService.get<string>('minio.region');
    this.endpoint = this.configService.get<string>('minio.host');
    this.port = this.configService.get<number>('minio.port');
  }

  async create(createCarDto: CreateCarDto, file: Express.Multer.File) {
    const imageTag = uuidv4().toString();
    try {
      await this.minioService.uploadFile(imageTag, file);
    } catch (e) {
      this.logger.error(`Failed to upload file: ${e}`);
      throw new InternalServerErrorException(`Failed to upload file: ${e}`);
    }

    return this.carsRepository.save({ ...createCarDto, imageTag: imageTag });
  }

  async findAll() {
    const cars = await this.carsRepository.find();
    return cars.map((car) => {
      return {
        ...car,
        imageUrl: this.generateImageUrl(car.imageTag),
      };
    });
  }

  async findOne(id: number) {
    const car = await this.carsRepository.findOne({
      where: { id: id },
    });

    if (!car) {
      throw new NotFoundException(`Car #${id} not found`);
    }

    return {
      ...car,
      imageUrl: this.generateImageUrl(car.imageTag),
    };
  }

  // update(id: number, updateCarDto: UpdateCarDto) {
  //   return `This action updates a #${id} car`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} car`;
  // }
  private generateImageUrl(imageTag: string): string {
    if (this.env === 'production') {
      return `${this.endpoint}/${this.region}/${imageTag}`;
    }

    return `http://${this.endpoint}:${this.port}/${this.region}/${imageTag}`;
  }
}
