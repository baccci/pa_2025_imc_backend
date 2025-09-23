import { Test, TestingModule } from '@nestjs/testing';
import { ImcController } from './imc.controller';
import { ImcService } from './imc.service';
import { CalcularImcDto } from './dto/calcular-imc-dto';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

describe('ImcController', () => {
  let controller: ImcController;
  let service: ImcService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImcController],
      providers: [
        {
          provide: ImcService,
          useValue: {
            calcularImc: jest.fn(), // Mockear el método calcularImc
            obtenerHistorial: jest.fn(), // Mockear el método obtenerHistorial
          },
        },
      ],
    }).compile();

    controller = module.get<ImcController>(ImcController);
    service = module.get<ImcService>(ImcService);
  });

  // Prueba básica para verificar que el controlador se define correctamente
  it('should be defined', () => {
    expect(controller).toBeDefined();
  }); 

  it('should return IMC and category for valid input', async () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 70 };
    const serviceSpy = jest.spyOn(service, 'calcularImc').mockResolvedValue({ imc: 22.86, categoria: 'Normal' });

    const result = await controller.calcular(dto);
    expect(result).toEqual({ imc: 22.86, categoria: 'Normal' });
    expect(serviceSpy).toHaveBeenCalledWith(dto);
  });

  it('should return IMC and category for valid input', async () => {
    const dto: CalcularImcDto = { altura: 1.82, peso: 40 };
    const serviceSpy = jest.spyOn(service, 'calcularImc').mockResolvedValue({ imc: 12.08, categoria: 'Bajo peso' });

    const result = await controller.calcular(dto);
    expect(result).toEqual({ imc: 12.08, categoria: 'Bajo peso' }); 
    expect(serviceSpy).toHaveBeenCalledWith(dto); 
  });
  
  it('should throw BadRequestException for invalid input', async () => {
    const invalidDto: CalcularImcDto = { altura: -1, peso: 70 };
    const serviceSpy = jest.spyOn(service, 'calcularImc');

    // Aplicar ValidationPipe manualmente en la prueba
    const validationPipe = new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true });

    await expect(validationPipe.transform(invalidDto, { type: 'body', metatype: CalcularImcDto }))
      .rejects.toThrow(BadRequestException);

    // Verificar que el servicio no se llama porque la validación falla antes
    expect(serviceSpy).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException for invalid input', async () => {
    const invalidDto: CalcularImcDto = { altura: 1.60, peso: -1 };
    const serviceSpy = jest.spyOn(service, 'calcularImc');

    // Aplicar ValidationPipe manualmente en la prueba
    const validationPipe = new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true });

    await expect(validationPipe.transform(invalidDto, { type: 'body', metatype: CalcularImcDto }))
      .rejects.toThrow(BadRequestException);

    // Verificar que el servicio no se llama porque la validación falla antes
    expect(serviceSpy).not.toHaveBeenCalled();
  });
});