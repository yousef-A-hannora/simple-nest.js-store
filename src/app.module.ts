import { Module } from '@nestjs/common';
import { UsersModule } from './Users/users.module';
import { productsModule } from './products/products.module';
import { ReviewsModule } from './Reviews/reviews.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './products/product.entity';

@Module({
  imports: [
    UsersModule,
    productsModule,
    ReviewsModule,
    TypeOrmModule.forRoot({
      database: 'nest-api-test',
      type: 'postgres',
      username: 'postgres',
      password: 'root',
      host: 'localhost',
      port: 5432,
      synchronize: true,
      entities: [ProductEntity],
    }),
  ],
})
export class AppModule {}
