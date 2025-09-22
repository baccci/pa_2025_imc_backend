import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';

export class CreateHistorialImcDto {
  @ApiProperty({ example: 1.6, description: 'Altura en metros (0–3)' })
  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'La altura debe ser un número válido' },
  )
  @Min(0, { message: 'La altura debe ser mayor a 0 metros' })
  @Max(3, { message: 'La altura no puede ser mayor a 3 metros' })
  altura!: number;

  @ApiProperty({ example: 90, description: 'Peso en kilogramos (0–500)' })
  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'El peso debe ser un número válido' },
  )
  @Min(0, { message: 'El peso debe ser mayor a 0 kg' })
  @Max(500, { message: 'El peso no puede ser mayor a 500 kg' })
  peso!: number;
}
