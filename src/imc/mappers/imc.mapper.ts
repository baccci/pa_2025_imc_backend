import { ImcEntity } from '../entities/imc.entity';
import { CalcularImcDto } from '../dto/calcular-imc-dto';

export class ImcMapper {
  static toEntity(dto: CalcularImcDto, imc: number, categoria: string): ImcEntity {
    const entity = new ImcEntity();
    entity.peso = dto.peso;
    entity.altura = dto.altura;
    entity.imc = imc;
    entity.categoria = categoria;
    // La fecha se asigna automáticamente por @CreateDateColumn
    return entity;
  }

  static toDto(entity: ImcEntity): CalcularImcDto & { imc: number; categoria: string; fecha: Date } {
    return {
      peso: entity.peso,
      altura: entity.altura,
      imc: entity.imc,
      categoria: entity.categoria,
      fecha: entity.fecha,
    };
  }
}