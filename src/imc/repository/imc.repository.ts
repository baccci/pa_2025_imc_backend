import { Repository, DataSource } from 'typeorm';
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

  async findAll(): Promise<ImcEntity[]> {
    return this.find({order: { fecha: 'DESC' }});
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<ImcEntity>> {
    return paginate<ImcEntity>(this, options);
  }

  async saveRecord(entity: ImcEntity): Promise<ImcEntity> {
    return this.save(entity);
  }
}