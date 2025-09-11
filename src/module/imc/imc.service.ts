import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CalcularImcDto } from "./dto/calcular-imc-dto";
import { ImcEntity } from "./entities/imc.entity";
import { ImcMapper } from "./mappers/imc.mapper";


@Injectable()
export class ImcService {
  constructor(
    @InjectRepository(ImcEntity)
    private readonly imcRepository: Repository<ImcEntity>,
  ) {}

  async calcularImc(data: CalcularImcDto): Promise<{ imc: number; categoria: string }> {
    const { altura, peso } = data;
    const imc = peso / (altura * altura);
    const imcRedondeado = Math.round(imc * 100) / 100; // Dos decimales

    let categoria: string;
    if (imc < 18.5) {
      categoria = 'Bajo peso';
    } else if (imc < 25) {
      categoria = 'Normal';
    } else if (imc < 30) {
      categoria = 'Sobrepeso';
    } else {
      categoria = 'Obeso';
    }

    // Usar el mapper
    const imcRegistro = ImcMapper.toEntity(data, imcRedondeado, categoria);
    await this.imcRepository.save(imcRegistro);

    return { imc: imcRedondeado, categoria };
  }
  async obtenerHistorial(): Promise<(CalcularImcDto & { imc: number; categoria: string; fecha: Date })[]> {
    const registros = await this.imcRepository.find({
      order: { fecha: 'DESC' },
    });
    return registros.map(ImcMapper.toDto);
  }
}

