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
}