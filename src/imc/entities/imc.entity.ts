import { UserEntity } from 'src/auth/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';

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

  @ManyToOne(() => UserEntity, (user) => user.imcs, { eager: false })
  user: UserEntity;
}
