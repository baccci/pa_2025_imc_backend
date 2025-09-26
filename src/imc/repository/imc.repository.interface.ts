import { FindManyOptions } from 'typeorm';
import { ImcEntity } from '../entities/imc.entity';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';

export interface IImcRepository {
  findAll(options?: FindManyOptions<ImcEntity>): Promise<ImcEntity[]>;
  paginate(options: IPaginationOptions, findOptions?: FindManyOptions<ImcEntity>): Promise<Pagination<ImcEntity>>;
  saveRecord(entity: ImcEntity): Promise<ImcEntity>;
}