import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { productService } from './products.service';

@Module({ controllers: [ProductsController], providers: [productService] })
export class productsModule {}
