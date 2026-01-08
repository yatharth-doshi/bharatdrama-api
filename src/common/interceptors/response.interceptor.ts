import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

export interface ApiResponse<T> {
    statusCode: number;
    message: string;
    data?: T;
    timestamp: string;
    path: string;
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse<Response>();

        return next.handle().pipe(
            map((data) => {
                const statusCode = response.statusCode || HttpStatus.OK;
                return {
                    statusCode,
                    message: data?.message || 'Success',
                    data: data?.data || data,
                    timestamp: new Date().toISOString(),
                    path: request.url,
                } as ApiResponse<any>;
            }),
        );
    }
}
