import { Controller, Post, Get, Body, UsePipes, Query } from '@nestjs/common';
import { ImcService } from './imc.service';
import { CalcularImcDto } from './dto/calcular-imc-dto';
import { ValidateImcPipe } from './pipes/validate-imc.pipe';

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
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
  ) {
    if (desde || hasta) {
      return this.imcService.obtenerHistorialFiltrado(
        // Se pone undefined en el caso de que entre uno solo de los Query Params, si entra lo tranfosrma a Date
        desde ? new Date(desde) : undefined, 
        hasta ? new Date(hasta) : undefined,
      )
    }
    return this.imcService.obtenerHistorial();
  }

}