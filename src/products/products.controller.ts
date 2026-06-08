import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateProductDTO } from './dtos/create-product.dto';

type product = {
  id: number;
  name: string;
  price: number;
};

@Controller()
export class ProductsController {
  private myHumpleDB: product[] = [
    { id: 1, name: 'book', price: 30 },
    { id: 2, name: 'pen', price: 3 },
    { id: 3, name: 'labtop', price: 30000 },
  ];

  @Get('/api/products')
  public getAllProducts() {
    return this.myHumpleDB;
  }

  @Post('api/products')
  public createNewProduct(@Body() body: CreateProductDTO) {
    console.log(body);
    this.myHumpleDB.push({
      id: this.myHumpleDB[this.myHumpleDB.length - 1].id + 1,
      ...body,
    });
    return this.myHumpleDB;
  }
}
