import { Injectable, InternalServerErrorException } from "@nestjs/common";
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
    try {
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
    } catch (error) {
      console.error('Error en calcularImc:', error);
      throw new InternalServerErrorException('Error al calcular y guardar el IMC');
    }
  }

  async obtenerHistorial(): Promise<(CalcularImcDto & { imc: number; categoria: string; fecha: Date })[]> {
    try {
      const registros = await this.imcRepository.find({
        order: { fecha: 'DESC' },
      });
      return registros.map(ImcMapper.toDto);
    } catch (error) {
      console.error('Error en obtenerHistorial:', error);
      throw new InternalServerErrorException('Error al obtener el historial de IMC');
    }
  }
}

