import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/Users/Users.service';

@Injectable()
export class reviewsService {
  constructor(private readonly userService: UsersService) {}
  public getAll() {
    const reviews = [
      { id: 1, rating: 4, comment: 'good' },
      { id: 2, rating: 5, comment: 'very good' },
    ];
    const users = this.userService.getAll();
    return { reviews, users };
  }
}
