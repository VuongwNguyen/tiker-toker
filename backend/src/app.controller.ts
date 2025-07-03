import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { SuccessResponse, ErrorResponse } from './util/reponses';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): ErrorResponse | SuccessResponse {
    throw new ErrorResponse({
      message: 'This endpoint is not implemented yet.',
    });
  }
}
