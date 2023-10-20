import { Injectable, Logger } from '@nestjs/common';
import * as Minio from 'minio';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MinioService {
  private readonly minioClient: Minio.Client;
  private readonly logger: Logger = new Logger(MinioService.name);
  private readonly bucketName: string = this.configService.get('MINIO_REGION');
  private readonly region: string = this.configService.get('MINIO_REGION');

  constructor(private readonly configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get('MINIO_HOST'),
      port: parseInt(this.configService.get('MINIO_PORT')),
      useSSL: this.configService.get('MINIO_USE_SSL') === 'true',
      accessKey: this.configService.get('MINIO_ACCESS_KEY'),
      secretKey: this.configService.get('MINIO_SECRET_KEY'),
    });
  }

  makeBucket(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.minioClient.makeBucket(this.bucketName, this.region, (err: any) => {
        if (err) {
          this.logger.error(`Failed to create bucket: ${err}`);
          return reject(err);
        }

        this.logger.log(`Bucket created successfully in ${this.region}.`);
        return resolve();
      });
    });
  }

  async uploadFile(fileName: string, file: Express.Multer.File): Promise<void> {
    const metaData = {
      'Content-Type': file.mimetype,
    };
    await this.minioClient.putObject(
      this.bucketName,
      fileName,
      file.buffer,
      metaData,
    );
  }
}
