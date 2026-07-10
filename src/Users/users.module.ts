import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './Users.controller';
import { UsersService } from './Users.service';
import { ReviewsModule } from '../Reviews/reviews.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
  imports: [forwardRef(() => ReviewsModule), TypeOrmModule.forFeature([User])],
})
export class UsersModule {}
