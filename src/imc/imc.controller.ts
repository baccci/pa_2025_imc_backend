import { Controller, Post, Get, Body, UsePipes } from '@nestjs/common';
import { ImcService } from './imc.service';
import { CalcularImcDto } from './dto/calcular-imc-dto';
import { ValidateImcPipe } from './pipes/validate-imc.pipe';

@Controller('imc')
export class ImcController {
  constructor(private readonly imcService: ImcService) {}

  @Post('calcular')
  @UsePipes(ValidateImcPipe) // con el decorador @UsePipes se ejecuta antes que global
  calcular(@Body() data: CalcularImcDto) {
    return this.imcService.calcularImc(data);
  }

  @Get('historial')
  obtenerHistorial() {
    return this.imcService.obtenerHistorial();
  }
}