import { Controller, Post, Get, Body, UsePipes, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
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
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    return this.imcService.paginate(
      desde ? new Date(desde) : undefined,
      hasta ? new Date(hasta) : undefined,
      page,
      limit,
    );
  }

  @Get('historial-cantidad')
  async obtenerHistorialCantidad(
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
  ) {
    return this.imcService.obtenerHistorialCantidad(
      desde ? new Date(desde) : undefined,
      hasta ? new Date(hasta) : undefined,
    )
  }
}