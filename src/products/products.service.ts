import { HttpException, Injectable } from '@nestjs/common';
import { UpdateProductDTO } from './dtos/update-product.dto';
import { CreateProductDTO } from './dtos/create-product.dto';

type product = {
  id: number;
  name: string;
  price: number;
};
@Injectable()
export class productService {
  private myHumpleDB: product[] = [
    { id: 1, name: 'book', price: 30 },
    { id: 2, name: 'pen', price: 3 },
    { id: 3, name: 'labtop', price: 30000 },
  ];

  private deleteHistory: number[] = [];

  public getAll() {
    return this.myHumpleDB;
  }

  public getOneBy(id: number) {
    const product = this.myHumpleDB.find((p) => {
      return p.id === id;
    });
    if (!product) {
      throw new HttpException('Product not found', 404);
    }

    return product;
  }

  public create(createProductDTO: CreateProductDTO) {
    console.log(createProductDTO);
    this.myHumpleDB.push({
      id: this.myHumpleDB[this.myHumpleDB.length - 1].id + 1,
      ...createProductDTO,
    });
    return this.myHumpleDB;
  }

  public Update(UpdateProductDTO: UpdateProductDTO, id: number) {
    const index = this.myHumpleDB.findIndex((p) => p.id === id);
    if (index === -1) throw new HttpException('Product not found', 404);

    this.myHumpleDB[index] = {
      id,
      name: UpdateProductDTO.name
        ? UpdateProductDTO.name
        : this.myHumpleDB[index].name,
      price: UpdateProductDTO.price
        ? UpdateProductDTO.price
        : this.myHumpleDB[index].price,
    };
    return this.myHumpleDB[index];
  }

  public Delete(id: number) {
    const index = this.myHumpleDB.findIndex((p) => p.id === id);
    if (index === -1) {
      if (this.deleteHistory.includes(id)) {
        throw new HttpException('this object has been deleted before', 400);
      } else throw new HttpException('object with this id not found', 404);
    }
    this.myHumpleDB.splice(index, 1);
    this.deleteHistory.push(id);
    return this.myHumpleDB;
  }
}
