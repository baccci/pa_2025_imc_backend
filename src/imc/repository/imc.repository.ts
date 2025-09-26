import { Repository, DataSource, FindManyOptions } from 'typeorm';
import { ImcEntity } from '../entities/imc.entity';
import { Injectable } from '@nestjs/common';
import {
  paginate as pg,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { IImcRepository } from './imc.repository.interface';

@Injectable()
export class ImcRepository
  extends Repository<ImcEntity>
  implements IImcRepository
{
  constructor(private dataSource: DataSource) {
    super(ImcEntity, dataSource.createEntityManager());
  }

  async findAll(options?: FindManyOptions<ImcEntity>): Promise<ImcEntity[]> {
    return this.find(options);
  }

  async paginate(options: IPaginationOptions, findOptions?: FindManyOptions<ImcEntity>): Promise<Pagination<ImcEntity>> {
    return pg<ImcEntity>(this, options, findOptions);
  }

  async saveRecord(entity: ImcEntity): Promise<ImcEntity> {
    return this.save(entity);
  }
}