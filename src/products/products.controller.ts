/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateProductDTO } from './dtos/create-product.dto';
import { UpdateProductDTO } from './dtos/update-product.dto';
import { productService } from './products.service';
// import { reviewsService } from '../Reviews/reviews.service';
@Controller()
export class ProductsController {
  /**
   * good way to hndle servic,using  Dependancy injection
   */
  constructor(
    private readonly productServiceInstance: productService,
    // private readonly reviewsService: reviewsService,
  ) {}
  //get all products
  @Get('/api/products')
  public getAllProducts() {
    const products = this.productServiceInstance.getAll();
    // const reviews = this.reviewsService.getAll();
    // return { products,reviews };
    return products;
  }

  //get a single product by id
  @Get('/api/products/:id')
  public getproductByID(@Param('id', ParseIntPipe) id: number) {
    return this.productServiceInstance.getOneBy(id);
  }

  //create new product
  @Post('api/products')
  public createNewProduct(@Body() body: CreateProductDTO) {
    return this.productServiceInstance.create(body);
  }

  @Patch('api/products/:id')
  public UpdateProduct(
    @Body() updateData: UpdateProductDTO,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.productServiceInstance.Update(updateData, id);
  }

  @Delete('api/products/:id')
  public DeleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productServiceInstance.Delete(id);
  }
}
