import { Test, TestingModule } from "@nestjs/testing";
import { ImcService } from "./imc.service";
import { CalcularImcDto } from "./dto/calcular-imc-dto";


describe('ImcService', () => {
  let service: ImcService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImcService],
    }).compile();

    service = module.get<ImcService>(ImcService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should calculate IMC correctly', async () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 70 };
    const result = await service.calcularImc(dto);
    expect(result.imc).toBeCloseTo(22.86, 2); // Redondeado a 2 decimales
    expect(result.categoria).toBe('Normal');
  });

  it('should calculate IMC correctly', async () => {
    const dto: CalcularImcDto = { altura: 1.88, peso: 85 };
    const result = await service.calcularImc(dto);
    expect(result.imc).toBeCloseTo(24.05, 2);
    expect(result.categoria).toBe('Normal');
  });

  it('should calculate IMC correctly', async () => {
    const dto: CalcularImcDto = { altura: 1.80, peso: 75 };
    const result = await service.calcularImc(dto);
    expect(result.imc).toBeCloseTo(23.15, 2); // Redondeado a 2 decimales
    expect(result.categoria).toBe('Normal');
  });

  it('should return Bajo peso for IMC < 18.5', async () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 50 };
    const result = await service.calcularImc(dto);
    expect(result.imc).toBeCloseTo(16.33, 2);
    expect(result.categoria).toBe('Bajo peso');
  });

  it('should return Bajo peso for IMC < 18.5', async () => {
    const dto: CalcularImcDto = { altura: 1.80, peso: 40 };
    const result = await service.calcularImc(dto);
    expect(result.imc).toBeCloseTo(12.35, 2);
    expect(result.categoria).toBe('Bajo peso');
  });

  it('should return Bajo peso for IMC < 18.5', async () => {
    const dto: CalcularImcDto = { altura: 1.76, peso: 56 };
    const result = await service.calcularImc(dto);
    expect(result.imc).toBeCloseTo(18.08, 2);
    expect(result.categoria).toBe('Bajo peso');
  });

  it('should return Sobrepeso for 25 <= IMC < 30', async () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 80 };
    const result = await service.calcularImc(dto);
    expect(result.imc).toBeCloseTo(26.12, 2);
    expect(result.categoria).toBe('Sobrepeso');
  });

  it('should return Sobrepeso for 25 <= IMC < 30', async () => {
    const dto: CalcularImcDto = { altura: 1.79, peso: 83 };
    const result = await service.calcularImc(dto);
    expect(result.imc).toBeCloseTo(25.90, 2);
    expect(result.categoria).toBe('Sobrepeso');
  });

  it('should return Sobrepeso for 25 <= IMC < 30', async () => {
    const dto: CalcularImcDto = { altura: 1.54, peso: 71 };
    const result = await service.calcularImc(dto);
    expect(result.imc).toBeCloseTo(29.94, 2);
    expect(result.categoria).toBe('Sobrepeso');
  });

  it('should return Obeso for IMC >= 30', async () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 100 };
    const result = await service.calcularImc(dto);
    expect(result.imc).toBeCloseTo(32.65, 2);
    expect(result.categoria).toBe('Obeso');
  });

  it('should return Obeso for IMC >= 30', async () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 500 };
    const result = await service.calcularImc(dto);
    expect(result.imc).toBeCloseTo(163.27, 2);
    expect(result.categoria).toBe('Obeso');
  });

  it('should handle small numbers correctly', async () => {
    const dto: CalcularImcDto = { altura: 1.0, peso: 30 }; 
    const result = await service.calcularImc(dto);
    expect(result.imc).toBeCloseTo(30, 2);
    expect(result.categoria).toBe('Obeso');
  });
});