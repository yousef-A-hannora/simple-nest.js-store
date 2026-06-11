import { HttpException, Injectable } from '@nestjs/common';
import { UpdateProductDTO } from './dtos/update-product.dto';
import { CreateProductDTO } from './dtos/create-product.dto';
import { Repository } from 'typeorm';
import { ProductEntity } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class productService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly ProductsRepo: Repository<ProductEntity>,
  ) {}

  public async getAll() {
    return await this.ProductsRepo.find();
  }

  public async getOneBy(id: number) {
    const product = await this.ProductsRepo.findOne({ where: { id: id } });
    if (!product) {
      throw new HttpException('Product not found', 404);
    }

    return product;
  }

  public async create(createProductDTO: CreateProductDTO) {
    const NewProduct = this.ProductsRepo.create(createProductDTO);
    return await this.ProductsRepo.save(NewProduct);
  }

  public async Update(UpdateProductDTO: UpdateProductDTO, id: number) {
    await this.ProductsRepo.update(id, UpdateProductDTO);
    return { message: 'object updated' };
  }

  public async Delete(id: number) {
    const product = await this.getOneBy(id);
    await this.ProductsRepo.remove(product);

    return { message: 'object deleted' };
  }
}
