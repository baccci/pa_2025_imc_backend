import { ApiProperty } from '@nestjs/swagger';

export class HistorialImcResponse {
  @ApiProperty({ example: 1.6, description: 'Altura en metros' })
  altura: number;

  @ApiProperty({ example: 90, description: 'Peso en kilogramos' })
  peso: number;

  @ApiProperty({ example: '2025-09-22T18:21:00.000Z', description: 'Fecha de registro (ISO)' })
  fecha: Date;

  @ApiProperty({ example: 'Obeso', description: 'Categoría del IMC' })
  categoria: string;

  @ApiProperty({ example: 25.16, description: 'Índice de Masa Corporal calculado' })
  imc: number;
}