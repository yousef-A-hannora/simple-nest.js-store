import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { UsersModule } from './Users/users.module';
import { productsModule } from './products/products.module';
import { ReviewsModule } from './Reviews/reviews.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './products/product.entity';
import { ConfigModule } from '@nestjs/config';
import { Review } from './Reviews/reviews.entity';
import { User } from './Users/user.entity';
import { AuthModule } from './auth/auth.module';
import { auth } from './auth/auth.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    UsersModule,
    productsModule,
    ReviewsModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      database: process.env.DATABASE_NAME,
      type: 'postgres',
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      host: 'localhost',
      port: 5432,
      synchronize: true,
      entities: [ProductEntity, Review, User, auth],
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
  controllers: [],
})
export class AppModule {}
