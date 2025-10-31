import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const statusCode = context.switchToHttp().getResponse().statusCode;
    
    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === 'object' && 'data' in data && 'meta' in data) {
          // paginated response case
          return {
            statusCode,
            message: 'Success',
            data: data.data,
            meta: data.meta,
          };
        }

        return {
          statusCode,
          message: 'Success',
          data,
        };
      }),
    );
  }
}