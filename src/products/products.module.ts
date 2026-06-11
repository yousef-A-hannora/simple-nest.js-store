import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { productService } from './products.service';
import { ReviewsModule } from 'src/Reviews/reviews.module';
import { ProductEntity } from './product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [ProductsController],
  providers: [productService],
  imports: [ReviewsModule, TypeOrmModule.forFeature([ProductEntity])],
})
export class productsModule {}
