import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
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

  async obtenerHistorial(): Promise<(CalcularImcDto & { imc: number; categoria: string; fecha: Date})[]> {
    try {
      // Obtener registros ordenados por fecha descendente
      const registros = await this.imcRepository.find({
        order: { fecha: 'DESC' }, 
      });
      // Mapear entidades a DTOs
      return registros.map((r) => ImcMapper.toDto(r)); // 
    } catch (error) {
      console.error('Error en obtenerHistorial:', error);
      throw new InternalServerErrorException('Error al obtener el historial de IMC');
    }
  }

  async obtenerHistorialFiltrado(desde?: Date, hasta?: Date) {
    try {
      // Crear un objeto where que luego se pasa a TypeORM para filtrar
      let where = {}
      
      if (desde && hasta) {
        where = { fecha: Between(desde, hasta) } // Traer los registros cuya columna fecha esté entre esas dos fechas
      } else if (desde) {
        where = { fecha: MoreThanOrEqual(desde) } // Traer los registros con fecha >= desde
      } else if (hasta) {
        where = { fecha: LessThanOrEqual(hasta) } // Traer los registros con fecha <= hasta
      }

      // Consultar a la base de datos con el filtro de fecha
      const registros = await this.imcRepository.find({
        where,
        order: { fecha: 'DESC' },
      })

      // Mapear entidades a DTOs
      return registros.map((r) => ImcMapper.toDto(r))

    } catch (error) {
      console.error('Error en obtenerHistorialFiltrado:', error)
      throw new InternalServerErrorException('Error al obtener el historial filtrado')
    }
  }
}

