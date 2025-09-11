// filepath: c:\Users\Usuario\Desktop\Proyectos Clase\proyecto-1\back\2025_proyecto1_back_imc\src\app.module.ts
import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ImcModule } from './module/imc/imc.module';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ImcModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT ?? '3306', 10),
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'imc_db',
      autoLoadEntities: true,
      synchronize: true, // Solo para desarrollo
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}