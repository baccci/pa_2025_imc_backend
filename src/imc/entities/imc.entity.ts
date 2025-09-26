import { Entity, Column, CreateDateColumn } from 'typeorm';
import { ObjectId } from 'mongodb';
import { ObjectIdColumn } from 'typeorm/decorator/columns/ObjectIdColumn';

@Entity('imc_calculos')
export class ImcEntity {
  @ObjectIdColumn()
  id: ObjectId;

  @Column('float')
  peso: number;

  @Column('float')
  altura: number;

  @Column('float')
  imc: number;

  @Column('varchar', { length: 50 })
  categoria: string;

  @CreateDateColumn()
  fecha: Date;
}
