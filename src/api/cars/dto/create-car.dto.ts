import { IsNumber, IsString } from 'class-validator';

export class CreateCarDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;
}
