import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('imc_calculos')
export class ImcEntity {
  @PrimaryGeneratedColumn()
  id: number;

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
