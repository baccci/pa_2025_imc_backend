import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

describe('MySQL Database Connection', () => {
  let module: TestingModule;
  let dataSource: DataSource;

  // Definimos las variables de entorno directamente
  process.env.DB_URL="mongodb+srv://thomas:inising44@imc.swzfa9j.mongodb.net/imc?retryWrites=true&w=majority&appName=imc";

  beforeAll(async () => {
     
    jest.setTimeout(20000); // 20 segundos
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: () => ({
            type: 'mongodb',
            url: process.env.DB_URL,
            ssl: true,
            autoLoadEntities: true,
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
    if (dataSource?.isInitialized) {
      await dataSource.destroy();
    }
  });
});
