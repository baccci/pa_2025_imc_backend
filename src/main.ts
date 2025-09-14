import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { parseCors } from './utils/parse-cors';
import { CONFIG_KEYS } from './env/config-keys';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const origin = configService.get(CONFIG_KEYS.ORIGIN) as string;

  app.enableCors({
    allowedHeaders: ['Content-Type', 'Authorization'],
    origin: parseCors(origin),
    credentials: false, // Desactivado hasta que se implemente el auth
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  );

  await app.listen(3000);
}
bootstrap();