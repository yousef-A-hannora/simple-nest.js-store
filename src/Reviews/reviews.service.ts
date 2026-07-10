import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../Users/Users.service';
import { Review } from './reviews.entity';
import { Repository } from 'typeorm';
import { CreateReviewDTO } from './dtos/create-review.dto';
import { UpdateReviewDto } from './dtos/update-review.dto';
@Injectable()
export class reviewsService {
  constructor(
    private readonly userService: UsersService,
    @InjectRepository(Review) private readonly Repo: Repository<Review>,
  ) {}
  public getAll() {
    return this.Repo.find({
      relations: { user: true, product: true },
    });
  }

  public async getOneBy(id: number) {
    const review = await this.Repo.findOne({ where: { id } });
    if (!review)
      throw new HttpException('this review not fount, tr another one', 404);

    return review;
  }

  public async create(DTO: CreateReviewDTO) {
    const review = this.Repo.create(DTO);
    return this.Repo.save(review);
  }

  public async update(DTO: UpdateReviewDto, id: number) {
    await this.Repo.update(id, DTO);
    return { message: 'review updated' };
  }

  public async delete(id: number) {
    await this.Repo.delete(id);
    return { message: 'deleted updated' };
  }
}
