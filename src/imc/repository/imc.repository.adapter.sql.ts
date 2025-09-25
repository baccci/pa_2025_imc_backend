import { Repository, DataSource } from 'typeorm';
import { ImcEntity } from '../entities/imc.entity';
import { IImcRepository } from './imc.repository.interface';
import { SelectQueryBuilder } from 'typeorm';

export class ImcRepositorySQL extends Repository<ImcEntity> implements IImcRepository {
  constructor(dataSource: DataSource) {
    super(ImcEntity, dataSource.createEntityManager());
  }
  qb = this.createQueryBuilder('imc');
  findAll(): Promise<ImcEntity[]> {
    return this.find();
  }

  saveRecord(entity: ImcEntity): Promise<ImcEntity> {
    return this.save(entity);
  }


  findByFechas(desde?: Date, hasta?: Date) : SelectQueryBuilder<ImcEntity>{
    if (desde && hasta) {
      this.qb.where('imc.fecha BETWEEN :desde AND :hasta', { desde, hasta });
    } else if (desde) {
      this.qb.where('imc.fecha >= :desde', { desde });
    } else if (hasta) {
      this.qb.where('imc.fecha <= :hasta', { hasta });
    }
    return this.qb.orderBy('imc.fecha', 'DESC');
  }
}
