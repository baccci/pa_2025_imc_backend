import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ImcEntity } from './entities/imc.entity';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { envSchema } from '../env/env-schema';
// import { CONFIG_KEYS } from '../env/config-keys';

describe('MySQL Database Connection', () => {
  let module: TestingModule;
  let dataSource: DataSource;

  // Definimos las variables de entorno directamente
  process.env.DB_HOST = 'localhost';
  process.env.DB_PORT = '3306';
  process.env.DB_USER = 'root';
  process.env.DB_PASSWORD = '123456';
  process.env.DB_NAME = 'imc_test';

  beforeAll(async () => {
     
    jest.setTimeout(20000); // 20 segundos
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: () => ({
            type: 'mysql' as const,
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT!, 10),
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: [ImcEntity],
            synchronize: true, // crea tablas automáticamente para testing
          }),
        }),
      ],
    }).compile();

    dataSource = module.get<DataSource>(getDataSourceToken());

    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
  }, 20000);

  it('should initialize MySQL connection', () => {
    expect(dataSource.isInitialized).toBe(true);
  });

  afterAll(async () => {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });
});
