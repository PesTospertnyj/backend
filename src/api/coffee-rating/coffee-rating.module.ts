import { Module } from '@nestjs/common';
import { CoffeeRatingService } from './coffee-rating.service';
import { CoffeesModule } from '../coffees/coffees.module';

@Module({
  imports: [CoffeesModule],
  controllers: [],
  providers: [CoffeeRatingService],
  exports: [],
})
export class CoffeeRatingModule {}
