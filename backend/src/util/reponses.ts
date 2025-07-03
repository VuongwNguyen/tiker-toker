import { HttpException } from '@nestjs/common';

export class SuccessResponse<T = any> {
  statusResponse: boolean;
  message: string;
  statusCode: number;
  meta?: T;

  constructor({
    meta,
    message,
    statusCode = 200,
  }: {
    meta?: T;
    message: string;
    statusCode?: number;
  }) {
    this.statusResponse = true;
    this.message = message;
    this.statusCode = statusCode;
    this.meta = meta;
  }
}

export class ErrorResponse extends HttpException {
  constructor({
    message = 'Internal server error',
    statusCode = 500,
    statusResponse = false,
  }: {
    message?: string;
    statusCode?: number;
    statusResponse?: boolean;
  }) {
    super(
      {
        statusResponse,
        message,
        statusCode,
      },
      statusCode,
    );
  }
}
