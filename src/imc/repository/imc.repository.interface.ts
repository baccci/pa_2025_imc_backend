import { ImcEntity } from '../entities/imc.entity';
export interface IImcRepository {
  findAll(): Promise<ImcEntity[]>;
  saveRecord(entity: ImcEntity): Promise<ImcEntity>;
  findByFechas(desde?: Date, hasta?: Date): any;
}