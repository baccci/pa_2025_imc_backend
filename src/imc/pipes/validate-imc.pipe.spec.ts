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
      expect(result).toEqual({ altura: 1.75, peso: 70 });
    });

    // Casos de error: objeto inválido
    it('should throw BadRequestException for null input',  () => {
      expect(() => pipe.transform(null)).toThrow(BadRequestException);
      expect(() => pipe.transform(null)).toThrow(
        'Se deben proporcionar datos válidos para el cálculo del IMC.',
      );
    });

    it('should throw BadRequestException for non-object input', () => {
      expect(() => pipe.transform('invalid')).toThrow(BadRequestException);
      expect(() => pipe.transform('invalid')).toThrow(
        'Se deben proporcionar datos válidos para el cálculo del IMC.',
      );
    });

    // Casos de error: campos faltantes
    it('should throw BadRequestException for missing altura', () => {
      const invalidInput = { peso: 70 }; 
      expect(() => pipe.transform(invalidInput)).toThrow(BadRequestException);
      expect(() => pipe.transform(invalidInput)).toThrow(
        'Se requieren los campos "altura" y "peso".',
      );
    });

    it('should throw BadRequestException for missing peso', () => {
      const invalidInput = { altura: 1.75 };
      expect(() => pipe.transform(invalidInput)).toThrow(BadRequestException);
      expect(() => pipe.transform(invalidInput)).toThrow(
        'Se requieren los campos "altura" y "peso".',
      );
    });

    // Casos de error: valores no numéricos
    it('should throw BadRequestException for non-numeric altura', () => {
      const invalidInput = { altura: 'invalid', peso: 70 };
      expect(() => pipe.transform(invalidInput)).toThrow(BadRequestException);
      expect(() => pipe.transform(invalidInput)).toThrow(
        'Altura y peso deben ser números válidos.',
      );
    });

    it('should throw BadRequestException for non-numeric peso', () => {
      const invalidInput = { altura: 1.75, peso: 'invalid' };
      expect(() => pipe.transform(invalidInput)).toThrow(BadRequestException);
      expect(() => pipe.transform(invalidInput)).toThrow(
        'Altura y peso deben ser números válidos.',
      );
    });

    // Casos de error: rangos inválidos
    it('should throw BadRequestException for altura < 0', () => {
      const invalidInput = { altura: -1, peso: 70 };
      expect(() => pipe.transform(invalidInput)).toThrow(BadRequestException);
      expect(() => pipe.transform(invalidInput)).toThrow(
        'La altura debe estar entre 0 y 3 metros.',
      );
    });

    it('should throw BadRequestException for altura > 3', () => {
      const invalidInput = { altura: 3.1, peso: 70 };
      expect(() => pipe.transform(invalidInput)).toThrow(BadRequestException);
      expect(() => pipe.transform(invalidInput)).toThrow(
        'La altura debe estar entre 0 y 3 metros.',
      );
    });

    it('should throw BadRequestException for peso < 0', () => {
      const invalidInput = { altura: 1.75, peso: -1 };
      expect(() => pipe.transform(invalidInput)).toThrow(BadRequestException);
      expect(() => pipe.transform(invalidInput)).toThrow(
        'El peso debe estar entre 0 y 500 kg.',
      );
    });

    it('should throw BadRequestException for peso > 500', () => {
      const invalidInput = { altura: 1.75, peso: 501 };
      expect(() => pipe.transform(invalidInput)).toThrow(BadRequestException);
      expect(() => pipe.transform(invalidInput)).toThrow(
        'El peso debe estar entre 0 y 500 kg.',
      );
    });
  });
});