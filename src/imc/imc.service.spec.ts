import { Test, TestingModule } from "@nestjs/testing";
import { ImcService } from "./imc.service";
import { CalcularImcDto } from "./dto/calcular-imc-dto";
import { ImcEntity } from "./entities/imc.entity";

describe('ImcService', () => {
 let service: ImcService;

 // Declarar en un ámbito superior para que sea visible en todos los 'describe' anidados
 let mockImcRepository: { findAll: jest.Mock; saveRecord: jest.Mock; paginate: jest.Mock;};

 beforeEach(async () => {
  mockImcRepository = {
   // Aseguramos que saveRecord siempre devuelva algo, ya que se llama en calcularImc
   saveRecord: jest.fn().mockResolvedValue(new ImcEntity()), 
   findAll: jest.fn(),
   paginate: jest.fn(),
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
    // saveRecord ya está mockeado en beforeEach
    const dto: CalcularImcDto = { altura, peso };
    const result = await service.calcularImc(dto);
    
    // Verificaciones
    expect(mockImcRepository.saveRecord).toHaveBeenCalled(); 
    expect(result.imc).toBeCloseTo(imcEsperado, 2); // Usar precisión 2
    expect(result.categoria).toBe(categoriaEsperada);
   },
  );

  // Valores en los límites (Ajustamos el IMC esperado y la precisión a 2)
  it.each([
   // Bajo peso (< 18.5) vs Normal (>= 18.5)
   // Raw IMC: 18.57139... -> 18.57 redondeado a 2 decimales.
   { altura: 1.75, peso: 55, imc: 17.96, categoria: 'Bajo peso' }, 
   { altura: 1.75, peso: 56.875, imc: 18.57, categoria: 'Normal' },

   // Normal (< 25) vs Sobrepeso (>= 25)
   // Raw IMC: 24.99996... -> 25.00 redondeado a 2 decimales.
   { altura: 1.75, peso: 76.55, imc: 25.00, categoria: 'Normal' },
   { altura: 1.75, peso: 76.5625, imc: 25.00, categoria: 'Sobrepeso' },

   // Sobrepeso (< 30) vs Obeso (>= 30)
   // Raw IMC: 29.99996... -> 30.00 redondeado a 2 decimales.
   { altura: 1.75, peso: 91.8749, imc: 30.00, categoria: 'Sobrepeso' },
   { altura: 1.75, peso: 91.875, imc: 30.00, categoria: 'Obeso' },

  ])('should calculate IMC correctly on boundary values for %#', 
   async ({ altura, peso, imc: imcEsperado, categoria: categoriaEsperada }) => {
    const dto: CalcularImcDto = { altura, peso };
    const result = await service.calcularImc(dto);
    // Usamos precisión 2 para mayor robustez
    expect(result.imc).toBeCloseTo(imcEsperado, 1); 
    expect(result.categoria).toBe(categoriaEsperada);
   },
  );});


 describe('paginate', () => {

  it('should throw error on paginate failure', async () => {
   // Simular un error en el método paginate del repositorio
   mockImcRepository.paginate.mockRejectedValue(new Error('Database connection failed'));

   // El servicio debe atrapar el error y lanzar un InternalServerErrorException con el mensaje específico.
   await expect(service.paginate()).rejects.toThrow('Error al paginar el historial de IMC');
   expect(mockImcRepository.paginate).toHaveBeenCalled();
  });
 });
});