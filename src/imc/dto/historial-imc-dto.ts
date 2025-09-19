import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class HistorialImcDto {
    @ApiProperty({ example: 1.6, description: 'Altura en metros' })
    @Type(() => Number)
    @IsNumber()
    altura: number;

    @ApiProperty({ example: 90, description: 'Peso en kilogramos' })
    @Type(() => Number)
    @IsNumber()
    peso: number;

    @Type(() => Date)
    @IsDate()
    fecha: Date;

    @ApiProperty({ example: 'Obeso', description: 'Categoría del IMC' })
    @IsString()
    categoria: string;

    @ApiProperty({ example: 25.16, description: 'Índice de Masa Corporal (IMC)' })
    @Type(() => Number)
    @IsNumber()
    imc: number;
}
