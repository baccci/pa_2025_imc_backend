import { Controller, Post, Get, Body, UsePipes, Query } from '@nestjs/common';
import { ImcService } from './imc.service';
import { CalcularImcDto } from './dto/calcular-imc-dto';
import { ValidateImcPipe } from './pipes/validate-imc.pipe';
import { PaginationImcDto } from './dto/pagination-imc.dto';

@Controller('imc')
export class ImcController {
  constructor(private readonly imcService: ImcService) { }

  @Post('calcular')
  @UsePipes(ValidateImcPipe) // con el decorador @UsePipes se ejecuta antes que global
  calcular(@Body() data: CalcularImcDto) {
    return this.imcService.calcularImc(data);
  }

  @Get('health')
  health() {
    return {
      status: 'ok',
    };
  }

  @Get('historial')
  async obtenerHistorial(
    // Definir Query Params, en el caso en que no estén trae el historial completo
    @Query() PaginationImcDto: PaginationImcDto) {
    const { desde, hasta, page, limit } = PaginationImcDto;
    return this.imcService.paginate(
      desde, hasta, page, limit
    );
  }
}