import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Включаем валидацию
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Настройка CORS
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Настройка Swagger документации
  const config = new DocumentBuilder()
    .setTitle('Spiral Dynamics Testing API')
    .setDescription('API для системы тестирования спиральной динамики Грейвза')
    .setVersion('1.0')
    .addTag('spiral-dynamics', 'Основные операции с тестированием')
    .addTag('tests', 'Управление тестами')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 Сервер запущен на порту ${port}`);
  console.log(`📚 Swagger документация: http://localhost:${port}/api`);
}

bootstrap();
