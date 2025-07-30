import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const localtunnel = require('localtunnel');

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

  // Создаем локальный туннель только если задана переменная окружения
  if (process.env.USE_TUNNEL === 'true' || process.env.ENABLE_TUNNEL === 'true') {
    console.log(`🌐 Tunnel mode enabled...`);
    try {
      const tunnel = await localtunnel({ 
        port: Number(port),
        subdomain: 'spiral-dynamics-alice' // Попытка зарезервировать поддомен
      });
      
      console.log(`🌐 Public URL for Alice: ${tunnel.url}`);
      console.log(`📝 Use this URL in Yandex.Dialogs console: ${tunnel.url}`);
      
      tunnel.on('close', () => {
        console.log('❌ Tunnel closed');
      });
      
      tunnel.on('error', (err: Error) => {
        console.error('❌ Tunnel error:', err.message);
      });
      
      // Обработка закрытия приложения
      process.on('SIGINT', () => {
        console.log('\n🔄 Closing tunnel...');
        tunnel.close();
        process.exit(0);
      });
      
    } catch (error) {
      console.error('❌ Failed to create tunnel:', error);
      console.log('💡 You can manually create tunnel with: npx localtunnel --port 3000');
    }
  } else {
    console.log(`💡 To enable public tunnel, run: npm run start:tunnel`);
    console.log(`💡 Or manually: npx localtunnel --port ${port}`);
  }
}

bootstrap();
