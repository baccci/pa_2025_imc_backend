import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidateImcPipe implements PipeTransform {
  transform(value: unknown): { altura: number; peso: number } {
    try {
      // Validación inicial: verificar que el valor sea un objeto no nulo
      if (!value || typeof value !== 'object') {
        throw new BadRequestException('Se deben proporcionar datos válidos para el cálculo del IMC.');
      }

      // Verificar que altura y peso existan en el objeto
      if (!('altura' in value) || !('peso' in value)) {
        throw new BadRequestException('Se requieren los campos "altura" y "peso".');
      }

      // Convertir altura y peso a números
      const altura = Number(value.altura);
      const peso = Number(value.peso);

      // Validar que no sean NaN ni Infinity
      if (isNaN(altura) || !isFinite(altura)) {
        throw new BadRequestException('La altura debe ser un número válido');
      }
      if (isNaN(peso) || !isFinite(peso)) {
        throw new BadRequestException('El peso debe ser un número válido');
      }

      // Validar rangos
      if (altura <= 0) {
        throw new BadRequestException('La altura debe ser mayor a 0 metros');
      }
      if (altura > 3) {
        throw new BadRequestException('La altura no puede ser mayor a 3 metros');
      }
      if (peso <= 0) {
        throw new BadRequestException('El peso debe ser mayor a 0 kg');
      }
      if (peso > 500) {
        throw new BadRequestException('El peso no puede ser mayor a 500 kg');
      }

      // Devolver el objeto validado con altura y peso como números
      return { altura, peso };
    } 
    catch (error) {
      console.error('Error en ValidateImcPipe:', error);
      
      if (error instanceof BadRequestException) {
        throw error; // Re-lanzar excepciones específicas
      }
      throw new BadRequestException('Error inesperado durante la validación del IMC.');
    }
  }
}