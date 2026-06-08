import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  public getAll() {
    return [
      { id: 1, name: 'yousef', age: 22 },
      { id: 2, name: 'Ahmed', age: 42 },
    ];
  }
}
