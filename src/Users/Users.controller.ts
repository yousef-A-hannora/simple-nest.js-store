import { Controller, Get } from '@nestjs/common';
@Controller()
export class UsersController {
  // GET: ~/api/reviews
  @Get('/api/users')
  public getAllReviews() {
    return [
      { id: 1, name: 'yousef', age: 22 },
      { id: 2, name: 'Ahmed', age: 42 },
    ];
  }
}
