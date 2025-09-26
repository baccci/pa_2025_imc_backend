import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { CalcularImcDto } from "./dto/calcular-imc-dto";
import { ImcMapper } from "./mappers/imc.mapper";
import { IImcRepository } from "./repository/imc.repository.interface";
import { Inject } from "@nestjs/common";
import { Between, FindManyOptions, LessThanOrEqual, MoreThanOrEqual } from "typeorm";
import { ImcEntity } from "./entities/imc.entity";

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

  async paginate(desde?: Date, hasta?: Date, page: number = 1, limit: number = 10){
    try {
      const findOptions: FindManyOptions<ImcEntity> = {
        order: { fecha: 'DESC' },
      };

      if (desde && hasta) {
        findOptions.where = { fecha: Between(desde, hasta) };
      } else if (desde) {
        findOptions.where = { fecha: MoreThanOrEqual(desde) };
      } else if (hasta) {
        findOptions.where = { fecha: LessThanOrEqual(hasta) };
      }

      const pagination = await this.imcRepository.paginate({
        page,
        limit,
        route: '/imc/historial',
      }, findOptions);

      const mappedItems = pagination.items.map((r) => ImcMapper.toDto(r));

      return {
        ...pagination,
        items: mappedItems
      };
    } catch (error) {
      console.error('Error en paginate:', error)
      throw new InternalServerErrorException('Error al paginar el historial de IMC')
    }
  }
}