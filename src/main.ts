import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { parseCors } from './utils/parse-cors';
import { CONFIG_KEYS } from './env/config-keys';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('IMC API') // Título de la API
    .setDescription('API para calcular y consultar IMC') // Descripción
    .setVersion('1.0') // Versión
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

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