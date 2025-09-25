import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { CalcularImcDto } from "./dto/calcular-imc-dto";
import { ImcMapper } from "./mappers/imc.mapper";
import { IImcRepository } from "./repository/imc.repository.interface";
import { paginate as pg } from 'nestjs-typeorm-paginate';
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

  async paginate(desde?: Date, hasta?: Date, page: number = 1, limit: number = 10) {
    try {
      const qb = this.imcRepository.findByFechas(desde, hasta);

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

}
