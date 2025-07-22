import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });
  app.use(cookieParser());
  app.use(
    '/uploads',
    express.static(join(__dirname, '..', 'uploads'), {
      maxAge: '0',
    }),
  );
  app.useWebSocketAdapter(new IoAdapter(app));
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
    exceptionFactory: (errors) => {
      const messages = errors.map(err => ({
        field: err.property,
        constraints: err.constraints
      }));
      return new BadRequestException(messages);
    }
  }));

  const config = new DocumentBuilder()
    .setTitle('mini-crm-dbc')
    .setDescription(' API Document for mini-crm-dbc ')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'jwt',
    )
    .build();
    const documnet = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app,documnet);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
