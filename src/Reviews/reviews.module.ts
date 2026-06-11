import { forwardRef, Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { reviewsService } from './reviews.service';
import { UsersModule } from 'src/Users/users.module';

@Module({
  controllers: [ReviewsController],
  providers: [reviewsService],
  exports: [reviewsService],
  imports: [forwardRef(() => UsersModule)],
})
export class ReviewsModule {}
