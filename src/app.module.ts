// filepath: c:\Users\Usuario\Desktop\Proyectos Clase\proyecto-1\back\2025_proyecto1_back_imc\src\app.module.ts
import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ImcModule } from './imc/imc.module';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { isProduction } from './utils/env-checker';
import { CONFIG_KEYS } from './env/config-keys';
import { envSchema } from './env/env-schema';

@Module({
  imports: [
    ImcModule,
    ConfigModule.forRoot({
      isGlobal: true,      
      envFilePath: '.env.temp',
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
        host: configService.get(CONFIG_KEYS.DB_HOST),
        port: parseInt(configService.get(CONFIG_KEYS.DB_PORT) ?? '3306', 10),
        username: configService.get(CONFIG_KEYS.DB_USER),
        password: configService.get(CONFIG_KEYS.DB_PASSWORD),
        database: configService.get(CONFIG_KEYS.DB_NAME),
        autoLoadEntities: true,
        synchronize: !isProduction(),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }