import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';

export class CalcularImcDto {
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'La altura debe ser un número válido' },
  )
  @Min(0, { message: 'La altura debe ser mayor a 0 metros' }) // Altura mínima razonable
  @Max(3, { message: 'La altura no puede ser mayor a 3 metros' }) // Altura máxima razonable
  @ApiProperty({ description: 'Altura en metros', example: 1.7 })
  altura: number;

  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'El peso debe ser un número válido' },
  ) 
  @Min(0, { message: 'El peso debe ser mayor a 0 kg' })
  @Max(500, { message: 'El peso no puede ser mayor a 500 kg' })
  @ApiProperty({ description: 'Peso en kilogramos', example: 70 })
  peso: number;
}
