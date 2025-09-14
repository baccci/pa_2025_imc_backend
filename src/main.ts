import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
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

  await app.listen(3000);
}
bootstrap();