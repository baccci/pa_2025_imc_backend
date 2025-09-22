import { FindManyOptions } from 'typeorm';
import { ImcEntity } from '../entities/imc.entity';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';

export interface IImcRepository {
  findAll(options?: FindManyOptions<ImcEntity>): Promise<ImcEntity[]>;
  paginate(options: IPaginationOptions): Promise<Pagination<ImcEntity>>;
  saveRecord(entity: ImcEntity): Promise<ImcEntity>;
  createQueryBuilder(alias: string): SelectQueryBuilder<ImcEntity>;
}
