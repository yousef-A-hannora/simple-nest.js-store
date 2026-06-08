import { Controller, Get } from '@nestjs/common';
import { reviewsService } from './reviews.service';
@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: reviewsService) {}
  // GET: ~/api/reviews
  @Get('/api/reviews')
  public getAllReviews() {
    return this.reviewsService.getAll();
  }
}
