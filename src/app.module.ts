import { Module } from '@nestjs/common';
import { UsersModule } from './Users/users.module';
import { productsModule } from './products/products.module';
import { ReviewsModule } from './Reviews/reviews.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './products/product.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    productsModule,
    ReviewsModule,
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
      synchronize: process.env.NODE_ENV === 'development',
      entities: [ProductEntity],
    }),
  ],
})
export class AppModule {}
