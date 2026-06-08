/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  Patch,
  Delete,
} from '@nestjs/common';
import { CreateProductDTO } from './dtos/create-product.dto';
import { UpdateProductDTO } from './dtos/update-product.dto';

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

  private deleteHistory: number[] = [];
  //get all products
  @Get('/api/products')
  public getAllProducts() {
    return this.myHumpleDB;
  }

  //get a single product by id
  @Get('/api/products/:id')
  public getproductByID(@Param('id') id: string) {
    const product = this.myHumpleDB.find((p) => {
      return p.id === parseInt(id);
    });
    if (!product) {
      throw new HttpException('Product not found', 404);
    }

    return product;
  }

  //create new product
  @Post('api/products')
  public createNewProduct(@Body() body: CreateProductDTO) {
    console.log(body);
    this.myHumpleDB.push({
      id: this.myHumpleDB[this.myHumpleDB.length - 1].id + 1,
      ...body,
    });
    return this.myHumpleDB;
  }

  @Patch('api/products/:id')
  /**
   * UpdateProduct
@Param('id') id:   */
  public UpdateProduct(
    @Body() updateData: Partial<UpdateProductDTO>,
    @Param('id') id: string,
  ) {
    const index = this.myHumpleDB.findIndex((p) => p.id === parseInt(id));

    console.log('index is ' + index);
    if (index === -1) throw new HttpException('Product not found', 404);

    this.myHumpleDB[index] = {
      id: parseInt(id),
      name: updateData.name ? updateData.name : this.myHumpleDB[index].name,
      price: updateData.price ? updateData.price : this.myHumpleDB[index].price,
    };
    return this.myHumpleDB[index];
  }

  @Delete('api/products/:id')
  /**
   * UpdateProduct
@Param('id') id:   */
  public DeleteProduct(@Param('id') id: string) {
    const index = this.myHumpleDB.findIndex((p) => p.id === parseInt(id));
    if (index === -1) {
      if (this.deleteHistory.includes(parseInt(id))) {
        throw new HttpException('this object has been deleted before', 400);
      } else throw new HttpException('object with this id not found', 404);
    }
    this.myHumpleDB.splice(index, 1);
    this.deleteHistory.push(parseInt(id));
    return this.myHumpleDB;
  }
}
