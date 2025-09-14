import { BadRequestException } from '@nestjs/common';
import { ValidateImcPipe } from './validate-imc.pipe';

describe('ValidateImcPipe', () => {
  let pipe: ValidateImcPipe;

  beforeEach(() => {
    pipe = new ValidateImcPipe();
  });

  describe('transform', () => {
    // Casos de éxito
    it('should return the input value for valid altura and peso', () => {
      const validInput = { altura: 1.75, peso: 70 };
      const result = pipe.transform(validInput);
      expect(result).toEqual(validInput);
    });

    it('should handle string inputs that can be converted to valid numbers', () => {
      const validInput = { altura: '1.75', peso: '70' };
      const result = pipe.transform(validInput);
      expect(result).toEqual(validInput);
    });

    // Casos de error: objeto inválido
    it('should throw BadRequestException for null input', async () => {
      await expect(pipe.transform(null as any)).rejects.toThrow(BadRequestException);
      await expect(pipe.transform(null as any)).rejects.toThrow(
        'Se deben proporcionar datos válidos para el cálculo del IMC.',
      );
    });

    it('should throw BadRequestException for non-object input', async () => {
      await expect(pipe.transform('invalid')).rejects.toThrow(BadRequestException);
      await expect(pipe.transform('invalid')).rejects.toThrow(
        'Se deben proporcionar datos válidos para el cálculo del IMC.',
      );
    });

    // Casos de error: campos faltantes
    it('should throw BadRequestException for missing altura', async () => {
      const invalidInput = { peso: 70 }  as { altura: unknown; peso: unknown }; // Forzar el tipo para simular la ausencia de 'altura'
      await expect(pipe.transform(invalidInput)).rejects.toThrow(BadRequestException);
      await expect(pipe.transform(invalidInput)).rejects.toThrow(
        'Se requieren los campos "altura" y "peso".',
      );
    });

    it('should throw BadRequestException for missing peso', async () => {
      const invalidInput = { altura: 1.75 } as { altura: unknown; peso: unknown }; // Forzar el tipo para simular la ausencia de 'peso'
      await expect(pipe.transform(invalidInput)).rejects.toThrow(BadRequestException);
      await expect(pipe.transform(invalidInput)).rejects.toThrow(
        'Se requieren los campos "altura" y "peso".',
      );
    });

    // Casos de error: valores no numéricos
    it('should throw BadRequestException for non-numeric altura', async () => {
      const invalidInput = { altura: 'invalid', peso: 70 };
      await expect(pipe.transform(invalidInput)).rejects.toThrow(BadRequestException);
      await expect(pipe.transform(invalidInput)).rejects.toThrow(
        'Altura y peso deben ser números válidos.',
      );
    });

    it('should throw BadRequestException for non-numeric peso', async () => {
      const invalidInput = { altura: 1.75, peso: 'invalid' };
      await expect(pipe.transform(invalidInput)).rejects.toThrow(BadRequestException);
      await expect(pipe.transform(invalidInput)).rejects.toThrow(
        'Altura y peso deben ser números válidos.',
      );
    });

    // Casos de error: rangos inválidos
    it('should throw BadRequestException for altura < 0', async () => {
      const invalidInput = { altura: -1, peso: 70 };
      await expect(pipe.transform(invalidInput)).rejects.toThrow(BadRequestException);
      await expect(pipe.transform(invalidInput)).rejects.toThrow(
        'La altura debe estar entre 0 y 3 metros.',
      );
    });

    it('should throw BadRequestException for altura > 3', async () => {
      const invalidInput = { altura: 3.1, peso: 70 };
      await expect(pipe.transform(invalidInput)).rejects.toThrow(BadRequestException);
      await expect(pipe.transform(invalidInput)).rejects.toThrow(
        'La altura debe estar entre 0 y 3 metros.',
      );
    });

    it('should throw BadRequestException for peso < 0', async () => {
      const invalidInput = { altura: 1.75, peso: -1 };
      await expect(pipe.transform(invalidInput)).rejects.toThrow(BadRequestException);
      await expect(pipe.transform(invalidInput)).rejects.toThrow(
        'El peso debe estar entre 0 y 500 kg.',
      );
    });

    it('should throw BadRequestException for peso > 500', async () => {
      const invalidInput = { altura: 1.75, peso: 501 };
      await expect(pipe.transform(invalidInput)).rejects.toThrow(BadRequestException);
      await expect(pipe.transform(invalidInput)).rejects.toThrow(
        'El peso debe estar entre 0 y 500 kg.',
      );
    });

    // Casos de error: manejo de errores inesperados
    it('should throw BadRequestException for unexpected errors', async () => {
      // Simular un error inesperado (por ejemplo, inyectando un error en la conversión)
      jest.spyOn(global, 'Number').mockImplementationOnce(() => {
        throw new Error('Unexpected error');
      });
      const input = { altura: 1.75, peso: 70 };
      await expect(pipe.transform(input)).rejects.toThrow(BadRequestException);
      await expect(pipe.transform(input)).rejects.toThrow(
        'Error inesperado durante la validación del IMC.',
      );
    });
  });
});