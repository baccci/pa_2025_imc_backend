import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidateImcPipe implements PipeTransform {
  transform(value: unknown): { altura: number; peso: number } {
    try {
      // Validación inicial: verificar que el valor sea un objeto no nulo
      const isInvalidObject = !value || typeof value !== 'object';
      if (isInvalidObject) {
        throw new BadRequestException('Se deben proporcionar datos válidos para el cálculo del IMC.');
      }

      // Verificar que altura y peso existan en el objeto
      const missingFields = !('altura' in value) || !('peso' in value);
      if (missingFields) {
        throw new BadRequestException('Se requieren los campos "altura" y "peso".');
      }

      // Convertir altura y peso a números
      const altura = Number(value.altura);
      const peso = Number(value.peso);

      // Validar que no sean NaN ni Infinity
      const invalidHeight = isNaN(altura) || !isFinite(altura);
      const invalidWeight = isNaN(peso) || !isFinite(peso);
      if (invalidHeight || invalidWeight) {
        throw new BadRequestException('Altura y peso deben ser números válidos.');
      }

      // Validar rangos
      if (altura <= 0 || altura > 3) {
        throw new BadRequestException('La altura debe estar entre 0 y 3 metros.');
      }
      if (peso <= 0 || peso > 500) {
        throw new BadRequestException('El peso debe estar entre 0 y 500 kg.');
      }

      // Devolver el objeto validado con altura y peso como números
      return { altura, peso };
    }
    catch (error) {
      //console.error('Error en ValidateImcPipe:', error);

      if (error instanceof BadRequestException) {
        throw error; // mantener el mensaje específico
      }

      // Para cualquier otro error, lanzar un mensaje genérico
      throw new BadRequestException('Error inesperado durante la validación del IMC.');
    }
  }
}