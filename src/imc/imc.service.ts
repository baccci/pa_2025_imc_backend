import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { CalcularImcDto } from "./dto/calcular-imc-dto";
import { ImcMapper } from "./mappers/imc.mapper";
import { IImcRepository } from "./repository/imc.repository.interface";
import { paginate as pg } from 'nestjs-typeorm-paginate';
import { HistorialImcResponse } from "./dto/historial-imc-dto";
import { Inject } from "@nestjs/common";

@Injectable()
export class ImcService {
  constructor(
    @Inject('IImcRepository') private readonly imcRepository: IImcRepository,
  ) { }

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
      await this.imcRepository.saveRecord(imcRegistro);

      return { imc: imcRedondeado, categoria };
    } catch (error) {
      console.error('Error en calcularImc:', error);
      throw new InternalServerErrorException('Error al calcular y guardar el IMC');
    }
  }

  async obtenerHistorial(): Promise<(HistorialImcResponse)[]> {
    try {
      // Obtener registros ordenados por fecha descendente
      const registros = await this.imcRepository.findAll();
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
      const registros = await this.imcRepository.findAll({
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

  async paginate(desde?: Date, hasta?: Date, page: number = 1, limit: number = 10) {
    try {
      const qb = this.imcRepository.createQueryBuilder('imc')
        .orderBy('imc.fecha', 'DESC');

      if (desde && hasta) {
        qb.andWhere('imc.fecha BETWEEN :desde AND :hasta', { desde, hasta });
      } else if (desde) {
        qb.andWhere('imc.fecha >= :desde', { desde });
      } else if (hasta) {
        qb.andWhere('imc.fecha <= :hasta', { hasta });
      }

      const pagination = await pg(qb, {
        page,
        limit,
        route: '/imc/historial',
      });

      const mappedItems = pagination.items.map((r) => ImcMapper.toDto(r));

      return {
        ...pagination,
        items: mappedItems,
      };
    } catch (error) {
      console.error('Error en paginate:', error)
      throw new InternalServerErrorException('Error al paginar el historial de IMC')
    }
  }

  async obtenerHistorialCantidad(desde?: Date, hasta?: Date) {
    try {
      if (desde || hasta) {
        const registros = await this.obtenerHistorialFiltrado(desde, hasta)
        return {
          count: registros.length
        }
      }

      const registros = await this.obtenerHistorial()
      return {
        count: registros.length
      }
    } catch (error) {
      console.error('Error en obtenerHistorialCantidad:', error)
      throw new InternalServerErrorException('Error al obtener la cantidad de registros')
    }
  }
}

