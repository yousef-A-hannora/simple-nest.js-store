import { forwardRef, Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { reviewsService } from './reviews.service';
import { UsersModule } from '../Users/users.module';
import { Review } from './reviews.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [ReviewsController],
  providers: [reviewsService],
  exports: [reviewsService],
  imports: [forwardRef(() => UsersModule), TypeOrmModule.forFeature([Review])],
})
export class ReviewsModule {}
