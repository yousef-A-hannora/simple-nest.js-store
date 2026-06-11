import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './Users.controller';
import { UsersService } from './Users.service';
import { ReviewsModule } from 'src/Reviews/reviews.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
  imports: [forwardRef(() => ReviewsModule)],
})
export class UsersModule {}
