import { MongoRepository } from 'typeorm';
import { ImcEntity } from '../entities/imc.entity';
import { IImcRepository } from './imc.repository.interface';

export class ImcRepositoryNoSQL implements IImcRepository {
  constructor(private readonly repository: MongoRepository<ImcEntity>) {}

  findAll(): Promise<ImcEntity[]> {
    return this.repository.find();
  }

  saveRecord(entity: ImcEntity): Promise<ImcEntity> {
    return this.repository.save(entity);
  }

  async findByFechas(desde?: Date, hasta?: Date) {
  const filter: any = {};
  if (desde && hasta) filter.fecha = { $gte: desde, $lte: hasta };
  else if (desde) filter.fecha = { $gte: desde };
  else if (hasta) filter.fecha = { $lte: hasta };

  const total = await this.repository.count({ where: filter });
  const data = await this.repository.find({
    where: filter,
    order: { fecha: 'DESC' },
    skip: (page - 1) * limit,
    take: limit,
  });

  return { data, total };
}
}