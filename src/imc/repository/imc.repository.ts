// src/imc/repository/imc.repository.ts
/*import { Repository, DataSource } from 'typeorm';
import { ImcEntity } from '../entities/imc.entity';
import { Injectable } from '@nestjs/common';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class ImcRepository extends Repository<ImcEntity> {
  constructor(private dataSource: DataSource) {
    super(ImcEntity, dataSource.createEntityManager());
  }

  async findA(): Promise<ImcEntity[]> {
    return this.find({
      order: {
         fecha: 'DESC',
        },  
    });
  }

  //Método para buscar un registro por su ID y su categoría
  async findByIdAndCategory(id: number, categoria: string): Promise<ImcEntity> {
    return this.findOne({
      where: { id, categoria },
    });
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<ImcEntity>> {
    return paginate<ImcEntity>(this.repository, options);
  }

  async saveRecord(entity: ImcEntity): Promise<ImcEntity> {
    return this.save(entity);
  }
}
*/