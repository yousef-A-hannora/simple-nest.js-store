import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { reviewsService } from './reviews.service';

@Module({
  controllers: [ReviewsController],
  providers: [reviewsService],
})
export class ReviewsModule {}
