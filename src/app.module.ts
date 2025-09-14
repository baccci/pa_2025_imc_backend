// filepath: c:\Users\Usuario\Desktop\Proyectos Clase\proyecto-1\back\2025_proyecto1_back_imc\src\app.module.ts
import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ImcModule } from './imc/imc.module';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { isDevelopment } from './utils/env-checker';
import { CONFIG_KEYS } from './env/config-keys';
import { envSchema } from './env/env-schema';

@Module({
  imports: [
    ImcModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get(CONFIG_KEYS.DB_HOST) || 'localhost',
        port: parseInt(configService.get(CONFIG_KEYS.DB_PORT) ?? '3306', 10),
        username: configService.get(CONFIG_KEYS.DB_USER) || 'root',
        password: configService.get(CONFIG_KEYS.DB_PASSWORD) || 'Root',
        database: configService.get(CONFIG_KEYS.DB_NAME) || 'imc_db',
        autoLoadEntities: true,
        synchronize: isDevelopment(),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }