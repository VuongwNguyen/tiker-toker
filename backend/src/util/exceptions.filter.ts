import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let meta: any = null;

    if (exception instanceof MongooseError.ValidationError) {
      statusCode = HttpStatus.BAD_REQUEST;
      message = 'Validation failed';
      meta = Object.values(exception.errors).map((err: any) => err.message);
    }

    else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const res = exception.getResponse();
      message =
        typeof res === 'string'
          ? res
          : (res as any)?.message || 'Something went wrong';
      meta = (res as any)?.error || null;
    }

    response.status(statusCode).json({
      statusResponse: false,
      message,
      statusCode,
      meta,
    });

    console.error(message, exception);
  }
}
