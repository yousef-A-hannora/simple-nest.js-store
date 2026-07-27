import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { from, Observable, of, switchMap, tap } from 'rxjs';
import { Request } from 'express';
import { redisClient } from '../redis';

@Injectable()
export class ProductsCacheInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return from(redisClient.get('products')).pipe(
      switchMap((products) => {
        if (products) {
          return of(JSON.parse(products));
        }
        return next.handle().pipe(
          tap((data) => {
            void redisClient.set('products', JSON.stringify(data));
          }),
        );
      }),
    );
  }
}
