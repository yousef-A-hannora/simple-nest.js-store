import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { productService } from './products.service';
import { ReviewsModule } from 'src/Reviews/reviews.module';

@Module({
  controllers: [ProductsController],
  providers: [productService],
  imports: [ReviewsModule],
})
export class productsModule {}
