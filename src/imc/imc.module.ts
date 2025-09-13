import { Module } from '@nestjs/common';
import { ImcService } from './imc.service';
import { ImcController } from './imc.controller';
import { ImcEntity } from './entities/imc.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ImcEntity])],
  controllers: [ImcController],
  providers: [ImcService],
})
export class ImcModule {}