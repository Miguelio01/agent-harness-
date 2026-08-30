import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Activate validation globally for class-validator DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // Enable CORS for Angular frontend
  app.enableCors();

  await app.listen(3000);
  console.log('=== NESTJS BACKEND RUNNING ON http://localhost:3000 ===');
}
bootstrap();
