import { Module } from '@nestjs/common';
import { UsersModule } from './Users/users.module';
import { productsModule } from './products/products.module';
import { ReviewsModule } from './Reviews/reviews.module';

@Module({ imports: [UsersModule, productsModule, ReviewsModule] })
export class AppModule {}
