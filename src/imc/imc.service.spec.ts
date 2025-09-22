import { Test, TestingModule } from "@nestjs/testing";
import { ImcService } from "./imc.service";
import { CalcularImcDto } from "./dto/calcular-imc-dto";
import { ImcEntity } from "./entities/imc.entity";
import { ImcMapper } from "./mappers/imc.mapper";
import { Between } from "typeorm";

describe('ImcService', () => {
  let service: ImcService;
  
  let mockImcRepository: { findAll: jest.Mock; saveRecord: jest.Mock; createQueryBuilder: jest.Mock;};

  beforeEach(async () => {
    mockImcRepository = {
      saveRecord: jest.fn(),
      findAll: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImcService,
        {
          provide: 'IImcRepository', 
          useValue: mockImcRepository,    
        },
      ],
    }).compile();

    service = module.get<ImcService>(ImcService);
  });

  it('should be defined', () => {
      expect(service).toBeDefined();
    });

  // Casos de prueba para calcularImc
  describe('calcularImc', () => {

    // Casos típicos
    it.each([
      // Normal
      { altura: 1.75, peso: 70, imc: 22.86, categoria: 'Normal' },
      { altura: 1.88, peso: 85, imc: 24.05, categoria: 'Normal' },
      { altura: 1.80, peso: 75, imc: 23.15, categoria: 'Normal' },

      // Bajo peso
      { altura: 1.75, peso: 50, imc: 16.33, categoria: 'Bajo peso' },
      { altura: 1.80, peso: 40, imc: 12.35, categoria: 'Bajo peso' },
      { altura: 1.76, peso: 56, imc: 18.08, categoria: 'Bajo peso' },

      // Sobrepeso
      { altura: 1.75, peso: 80, imc: 26.12, categoria: 'Sobrepeso' },
      { altura: 1.79, peso: 83, imc: 25.90, categoria: 'Sobrepeso' },
      { altura: 1.54, peso: 71, imc: 29.94, categoria: 'Sobrepeso' },

      // Obeso
      { altura: 1.75, peso: 100, imc: 32.65, categoria: 'Obeso' },
      { altura: 1.75, peso: 500, imc: 163.27, categoria: 'Obeso' },
      { altura: 1.0, peso: 40, imc: 40, categoria: 'Obeso' },
    ])(
      'should calculate IMC correctly for %#',
      async ({ altura, peso, imc: imcEsperado, categoria: categoriaEsperada }) => {
        mockImcRepository.saveRecord.mockResolvedValueOnce({ altura, peso, imc: imcEsperado, categoria: categoriaEsperada });

        const dto: CalcularImcDto = { altura, peso };
        const result = await service.calcularImc(dto);
        
        // Verificaciones
        expect(mockImcRepository.saveRecord).toHaveBeenCalled(); // Verifica que el método se llamó
        expect(result.imc).toBeCloseTo(imcEsperado, 2);
        expect(result.categoria).toBe(categoriaEsperada);
      },
    );

    // Valores en los límites
    it.each([
      { altura: 1.75, peso: 56.875, imc: 18.57, categoria: 'Normal' },       // límite inferior Normal
      { altura: 1.75, peso: 76.16, imc: 24.87, categoria: 'Normal' },        // límite superior Normal
      { altura: 1.75, peso: 76.875, imc: 25.10, categoria: 'Sobrepeso' },      // límite inferior Sobrepeso
      { altura: 1.75, peso: 91.56, imc: 29.90, categoria: 'Sobrepeso' },     // límite superior Sobrepeso
      { altura: 1.75, peso: 91.875, imc: 30, categoria: 'Obeso' },          // límite inferior Obeso
    ])('should calculate IMC correctly on boundary values for %#', 
      async ({ altura, peso, imc: imcEsperado, categoria: categoriaEsperada }) => {
        const dto: CalcularImcDto = { altura, peso };
        const result = await service.calcularImc(dto);
        expect(result.imc).toBeCloseTo(imcEsperado, 2);
        expect(result.categoria).toBe(categoriaEsperada);
      },
    );

  });

  // Casos de prueba para obtenerHistorial
  describe('obtenerHistorial', () => {

    beforeEach(() => {
      // Resetear mocks si es necesario
      jest.clearAllMocks();
    });

    it('should return an empty array when no records exist', async () => {
      mockImcRepository.findAll.mockResolvedValue([]);
      const result = await service.obtenerHistorial();
      expect(result).toEqual([]);
    });

    it('should call repository.find with correct order and map results', async () => {
      const mockRecords = [
        { altura: 1.75, peso: 70, imc: 22.86, categoria: 'Normal', fecha: new Date('2023-01-01') },
        { altura: 1.80, peso: 90, imc: 27.78, categoria: 'Sobrepeso', fecha: new Date('2023-02-01') },
      ] as ImcEntity[];

      const findSpy = jest.spyOn(mockImcRepository, 'findAll').mockResolvedValue(mockRecords);
      const mapperSpy = jest.spyOn(ImcMapper, 'toDto');

      const result = await service.obtenerHistorial();

      // Verificar que find fue llamado con la opción correcta
      expect(findSpy).toHaveBeenCalledWith();

      // Verificar que mapper fue llamado para cada registro
      expect(mapperSpy).toHaveBeenCalledTimes(mockRecords.length);

      // Verificar que el resultado es el esperado según el mapper
      expect(result).toEqual(mockRecords.map((r) => ({
        altura: r.altura,
        peso: r.peso,
        imc: r.imc,
        categoria: r.categoria,
        fecha: r.fecha,
      })));
    });

    it('should throw InternalServerErrorException if repository.find fails', async () => {
      jest.spyOn(mockImcRepository, 'findAll').mockRejectedValue(new Error('Error al obtener el historial de IMC'));

      await expect(service.obtenerHistorial())
        .rejects
        .toThrow('Error al obtener el historial de IMC');
      
     });

  });

  // Casos de prueba para obtenerHistorialFiltrado
describe('obtenerHistorialFiltrado', () => {
  it('should return all records when no filters are provided', async () => {
    const mockRecords = [{ altura: 1.75, peso: 70, imc: 22.86, categoria: 'Normal', fecha: new Date() }];
    mockImcRepository.findAll.mockResolvedValue(mockRecords);

    const result = await service.obtenerHistorialFiltrado();
    expect(mockImcRepository.findAll).toHaveBeenCalledWith({
      where: {},
      order: { fecha: 'DESC' },
    });
    expect(result.length).toBe(mockRecords.length);
  });

  it('should filter records by date range', async () => {
    const desde = new Date('2023-01-01');
    const hasta = new Date('2023-02-01');
    mockImcRepository.findAll.mockResolvedValue([]);

    await service.obtenerHistorialFiltrado(desde, hasta);
    expect(mockImcRepository.findAll).toHaveBeenCalledWith({
      where: { fecha: Between(desde, hasta) }, // Verificamos que pasa el filtro
      order: { fecha: 'DESC' },
    });
  });

  it('should filter records with desde only', async () => {
    const desde = new Date('2023-01-01');
    mockImcRepository.findAll.mockResolvedValue([]);

    await service.obtenerHistorialFiltrado(desde);
    expect(mockImcRepository.findAll).toHaveBeenCalled();
  });

  it('should filter records with hasta only', async () => {
    const hasta = new Date('2023-02-01');
    mockImcRepository.findAll.mockResolvedValue([]);

    await service.obtenerHistorialFiltrado(undefined, hasta);
    expect(mockImcRepository.findAll).toHaveBeenCalled();
  });

  it('should throw error when repository fails', async () => {
    mockImcRepository.findAll.mockRejectedValue(new Error('DB error'));
    await expect(service.obtenerHistorialFiltrado()).rejects.toThrow('Error al obtener el historial filtrado');
  });
});

// Casos de prueba para paginate
describe('paginate', () => {
  it('should return paginated results with mapping', async () => {
    const mockPagination = { items: [{ altura: 1.75, peso: 70, imc: 22.86, categoria: 'Normal' }], meta: { totalItems: 1 } };
    const qbMock = { 
      andWhere: jest.fn().mockReturnThis(), 
      orderBy: jest.fn().mockReturnThis(), 
      limit: jest.fn().mockReturnThis(),
      offset: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([mockPagination.items, mockPagination.meta.totalItems]) 
    };

    mockImcRepository.createQueryBuilder = jest.fn().mockReturnValue(qbMock);

    const paginateMock = jest.fn().mockResolvedValue(mockPagination);
    jest.mock('nestjs-typeorm-paginate', () => ({ paginate: paginateMock }));

    const result = await service.paginate();
    expect(result.items.length).toBe(1);
  });

  it('should throw error on paginate failure', async () => {
    mockImcRepository.createQueryBuilder = jest.fn().mockReturnValue({ orderBy: jest.fn().mockReturnThis(), andWhere: jest.fn().mockReturnThis() });
    jest.spyOn(service as any, 'paginate').mockRejectedValue(new Error('Error al paginar el historial de IMC'));

    await expect(service.paginate()).rejects.toThrow('Error al paginar el historial de IMC');
  });
});

// Casos de prueba para obtenerHistorialCantidad
describe('obtenerHistorialCantidad', () => {
  it('should return count without filters', async () => {
    jest.spyOn(service, 'obtenerHistorial').mockResolvedValue([{ imc: 22.86 } as any]);
    const result = await service.obtenerHistorialCantidad();
    expect(result.count).toBe(1);
  });

  it('should return count with filters', async () => {
    const desde = new Date('2023-01-01');
    jest.spyOn(service, 'obtenerHistorialFiltrado').mockResolvedValue([{ imc: 22.86 } as any]);
    const result = await service.obtenerHistorialCantidad(desde);
    expect(result.count).toBe(1);
  });

  it('should throw error on failure', async () => {
    jest.spyOn(service, 'obtenerHistorial').mockRejectedValue(new Error('DB error'));
    await expect(service.obtenerHistorialCantidad()).rejects.toThrow('Error al obtener la cantidad de registros');
  });
});


});

