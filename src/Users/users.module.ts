import { Module } from '@nestjs/common';
import { UsersController } from './Users.controller';

@Module({ controllers: [UsersController] })
export class UsersModule {}
