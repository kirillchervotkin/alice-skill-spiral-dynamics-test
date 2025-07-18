import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Включаем CORS для работы с Яндекс.Диалогами
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 Alice Skill "Spiral Dynamics" is running on: http://localhost:${port}`);
  console.log(`📊 Test endpoint: http://localhost:${port}/alice`);
}

bootstrap();
