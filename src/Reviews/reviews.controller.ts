import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Put,
  Delete,
} from '@nestjs/common';
import { reviewsService } from './reviews.service';
import { CreateReviewDTO } from './dtos/create-review.dto';
import { UpdateReviewDto } from './dtos/update-review.dto';
@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: reviewsService) {}
  // GET: ~/api/reviews
  @Get('/api/reviews')
  public getAllReviews() {
    return this.reviewsService.getAll();
  }

  @Get('/api/reviews:id')
  public getOne(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.getOneBy(id);
  }

  @Post('/api/reviews')
  public createNewReview(@Body() Body: CreateReviewDTO) {
    return this.reviewsService.create(Body);
  }

  @Put('/api/reviews/:id')
  public UpdateNewReview(
    @Body() Body: UpdateReviewDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.reviewsService.update(Body, id);
  }

  @Delete('/api/reviews:id')
  public Delete(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.delete(id);
  }
}
