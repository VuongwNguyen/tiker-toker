import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExceptionsFilter } from './util/exceptions.filter';
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.use(
    cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true, // Cho phép gửi cookie từ client
    }),
  );
  app.use(morgan('dev'));
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Tiker-Toker API')
    .setDescription('API for Tiker-Toker application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document);
  app.useGlobalFilters(new ExceptionsFilter());
  await app.listen(process.env.PORT ?? 3001);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
