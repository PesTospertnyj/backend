import { Injectable } from '@nestjs/common';
import { CoffeesService } from '../coffees/coffees.service';

@Injectable()
export class CoffeeRatingService {
  constructor(private readonly coffeeService: CoffeesService) {}
  // create(createCoffeeRatingDto: CreateCoffeeRatingDto) {
  //   return 'This action adds a new coffee-rating';
  // }

  // findAll() {
  //   return `This action returns all coffee-ratings`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #id coffee-rating`;
  // }

  // update(id: number, updateCoffeeRatingDto: UpdateCoffeeRatingDto) {
  //   return `This action updates a #id coffee-rating`;
  // }

  // remove(id: number) {
  //   return `This action removes a #id coffee-rating`;
  // }
}
