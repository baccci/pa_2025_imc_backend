import { Controller, Post, Get, Body, UsePipes } from '@nestjs/common';
import { ImcService } from './imc.service';
import { CalcularImcDto } from './dto/calcular-imc-dto';
import { ValidateImcPipe } from './pipes/validate-imc.pipe';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';

@ApiTags('IMC')
@Controller('imc')
export class ImcController {
  constructor(private readonly imcService: ImcService) { }

  @Post('calcular')
  @ApiOperation({ summary: 'Calcula el IMC y lo guarda en la base de datos' })
  @ApiBody({ type: CalcularImcDto })
  @ApiResponse({ status: 201, description: 'IMC calculado correctamente' })
  @UsePipes(ValidateImcPipe) // con el decorador @UsePipes se ejecuta antes que global
  calcular(@Body() data: CalcularImcDto) {
    return this.imcService.calcularImc(data);
  }

  @Get('health')
  @ApiOperation({ summary: 'Verifica el estado del servicio' })
  @ApiResponse({ status: 200, description: 'Servicio OK' })
  health() {
    return {
      status: 'ok',
    };
  }

  @Get('historial')
  @ApiOperation({ summary: 'Obtiene el historial de IMC, opcionalmente filtrado por fechas' })
  @ApiQuery({ name: 'desde', required: false, type: String })
  @ApiQuery({ name: 'hasta', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Lista de registros de IMC' })
  obtenerHistorial() {
    return this.imcService.obtenerHistorial();
  }
}