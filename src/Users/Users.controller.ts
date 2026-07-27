/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Req,
  UseGuards,
  // Post,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './Users.service';
// import { CreateUserDto } from './DTOs/create-user-dto';
import { UpdateUserDTO } from './DTOs/update-user-dto';
import { authGuardJWT } from '../auth/guards/auth.guard';
import type { Request } from 'express';
import type { AuthenticatedRequest } from '../utils/Interfaces/AuthRequest';
import { Roles } from '../auth/decorators/user-role.decorator';
import { roles } from '../utils/enums';
import { rolesGuard } from '../auth/guards/auth-roles.guard';
@Controller()
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  // GET: ~/api/users
  @Roles(roles.ADMIN)
  @UseGuards(authGuardJWT, rolesGuard)
  @Get('/api/users')
  public async getAllUsers() {
    const users = await this.userService.getAll();
    return users;
  }

  // GET: ~/api/users/:id
  @Get('/api/users/user')
  @UseGuards(authGuardJWT)
  public async getUserById(@Req() req: AuthenticatedRequest) {
    const id: number = req.user.id;
    const user = await this.userService.getOneBy(id, false);
    return user;
  }

  // @Post('/api/users')
  // public async createUser(@Body(new ValidationPipe()) body: CreateUserDto) {
  //   return await this.userService.create(body);
  // }

  @Patch('/api/users/:id')
  public async updateUser(
    @Body(new ValidationPipe()) body: UpdateUserDTO,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.userService.update(body, id);
  }

  @Delete('/api/users/:id')
  public async deleteUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.delete(id);
    if (user.isDeleted) {
      return { message: 'This user is already deleted' };
    }
    return { message: 'User deleted successfully' };
  }
}
