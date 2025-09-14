import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'https://2025-proyecto1-front-imc-drab.vercel.app',
  });
  
  await app.listen(3000);
}
bootstrap();