/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './Users.service';
// import { CreateUserDto } from './DTOs/create-user-dto';
import { UpdateUserDTO } from './DTOs/update-user-dto';
import { authGuardJWT } from '../auth/guards/auth.guard';
import * as bcrypt from 'bcrypt';
import type { AuthenticatedRequest } from '../utils/Interfaces/AuthRequest';
import { Roles } from '../auth/decorators/user-role.decorator';
import { roles } from '../utils/enums';
import { rolesGuard } from '../auth/guards/auth-roles.guard';
import { currentUser } from './decorators/current-user.decorator';
import type { JWTPayload } from './decorators/current-user.decorator';
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
  public async getUserById(@currentUser() payload: JWTPayload) {
    const id: number = payload.Id;
    const user = await this.userService.getOneBy(id, false);
    return user;
  }

  // @Post('/api/users')
  // public async createUser(@Body(new ValidationPipe()) body: CreateUserDto) {
  //   return await this.userService.create(body);
  // }

  /**
   * Update user info
   * @param body user data fields wanted to be updated
   * @returns
   */
  @UseGuards(authGuardJWT)
  @Patch('/api/users/')
  public async updateUser(
    @Body() body: UpdateUserDTO,
    @Req() req: AuthenticatedRequest,
  ) {
    const id = req.user.id;
    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }
    return await this.userService.update(body, id);
  }

  @UseGuards(authGuardJWT)
  @Delete('/api/users')
  public async deleteUser(@Req() req: AuthenticatedRequest) {
    const id = req.user.id;
    const user = await this.userService.delete(id);
    if (user.isDeleted) {
      return { message: 'This user is already deleted' };
    }
    return { message: 'User deleted successfully' };
  }
}
