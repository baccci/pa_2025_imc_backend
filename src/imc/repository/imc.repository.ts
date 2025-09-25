// imc.providers.ts
import { DataSource } from 'typeorm';
import { ImcRepositorySQL } from './imc.repository.adapter.sql';
import { ImcRepositoryNoSQL } from './imc.repository.adapter.no-sql';
import { IImcRepository } from './imc.repository.interface';
import { ImcEntity } from '../entities/imc.entity';

export const ImcRepositoryProvider = {
  provide: 'IImcRepository',
  useFactory: (dataSource: DataSource): IImcRepository => {
    if (process.env.DB_TYPE === 'nosql') {
      return new ImcRepositoryNoSQL(dataSource.getMongoRepository(ImcEntity));
    }
    return new ImcRepositorySQL(dataSource);
  },
  inject: [DataSource],
};
