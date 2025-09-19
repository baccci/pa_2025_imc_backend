import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ImcService } from './imc.service';
import { ImcEntity } from './entities/imc.entity';
import { CalcularImcDto } from './dto/calcular-imc-dto';
import { ImcRepository } from './repository/imc.repository';

describe('IMC Service Integration Tests', () => {
  let service: ImcService;
  let dataSource: DataSource;
  let imcRepository: ImcRepository;

  // Variables de entorno inline
  process.env.DB_HOST = 'localhost';
  process.env.DB_PORT = '3306';
  process.env.DB_USER = 'root';
  process.env.DB_PASSWORD = 'root';
  process.env.DB_NAME = 'imc_test';

  beforeAll(async () => {
    jest.setTimeout(20000); // 20 segundos
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: () => ({
            type: 'mysql' as const,
            host: process.env.DB_HOST ?? 'localhost',
            port: parseInt(process.env.DB_PORT ?? '3306', 10),
            username: process.env.DB_USER ?? 'root',
            password: process.env.DB_PASSWORD ?? '',
            database: process.env.DB_NAME ?? 'imc_test',
            entities: [ImcEntity],
            synchronize: true, // crea tablas automáticamente para testing
          }),
        }),
        TypeOrmModule.forFeature([ImcEntity]),
      ],
      providers: [ImcService, ImcRepository],
    }).compile();

    service = module.get<ImcService>(ImcService);
    dataSource = module.get<DataSource>(getDataSourceToken());
    imcRepository = module.get<ImcRepository>(ImcRepository);

    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
  }, 20000);

  afterEach(async () => {
    const repo = dataSource.getRepository(ImcEntity);
    await repo.clear(); // limpia la tabla después de cada test
  });

  afterAll(async () => {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  
  // =====================
  // Test: Create / calcularImc
  // =====================
  it('should calculate IMC and save record', async () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 70 };
    const result = await service.calcularImc(dto);

    expect(result.imc).toBeCloseTo(22.86, 1);
    expect(result.categoria).toBe('Normal');

    const repo = dataSource.getRepository(ImcEntity);
    const registros = await repo.find();
    expect(registros.length).toBe(1);
    expect(registros[0].imc).toBeCloseTo(22.86, 1);
    expect(registros[0].categoria).toBe('Normal');
  });

  // =====================
  // Test: Read / obtenerHistorial
  // =====================
  it('should return IMC history ordered by fecha DESC', async () => {
    await service.calcularImc({ altura: 1.75, peso: 50 }); // Bajo peso
    await service.calcularImc({ altura: 1.80, peso: 90 }); // Sobrepeso

    const historial = await service.obtenerHistorial();
    expect(historial.length).toBe(2);

    expect(historial[0].peso).toBe(50);
    expect(historial[0].categoria).toBe('Bajo peso');

    expect(historial[1].peso).toBe(90);
    expect(historial[1].categoria).toBe('Sobrepeso'); // coincide con la lógica actual
  });

  // =====================
  // Opcional: más tests de categorías
  // =====================
  it('should return correct categories', async () => {
    const casos: { dto: CalcularImcDto; categoria: string }[] = [
      { dto: { altura: 1.75, peso: 50 }, categoria: 'Bajo peso' },
      { dto: { altura: 1.75, peso: 70 }, categoria: 'Normal' },
      { dto: { altura: 1.75, peso: 80 }, categoria: 'Sobrepeso' },
      { dto: { altura: 1.75, peso: 100 }, categoria: 'Obeso' },
    ];

    for (const c of casos) {
      const result = await service.calcularImc(c.dto);
      expect(result.categoria).toBe(c.categoria);
    }
  });
});
