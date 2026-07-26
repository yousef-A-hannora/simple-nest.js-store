import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { auth } from './auth.entity';
import { UsersModule } from '../Users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([auth]), forwardRef(() => UsersModule)],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
