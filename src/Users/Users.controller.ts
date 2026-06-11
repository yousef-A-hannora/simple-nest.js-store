import { Controller, Get } from '@nestjs/common';
import { UsersService } from './Users.service';
@Controller()
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  // GET: ~/api/reviews
  @Get('/api/users')
  public getAllReviews() {
    const users = this.userService.getAll();
    return users;
  }
}
