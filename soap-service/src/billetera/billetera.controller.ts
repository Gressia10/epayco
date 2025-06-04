import { Controller, Post, Body } from '@nestjs/common';
import { BilleteraService } from './billetera.service';

@Controller('billetera')
export class BilleteraController {
  constructor(private readonly billeteraService: BilleteraService) {}

  @Post('registroCliente')
  async registroCliente(@Body() args: { documento: string; nombres: string; email: string; celular: string }) {
    return this.billeteraService.registroCliente(
      args.documento,
      args.nombres,
      args.email,
      args.celular
    );
  }

  @Post('recargarBilletera')
  async recargarBilletera(@Body() args: { documento: string; celular: string; valor: number }) {
    return this.billeteraService.recargarBilletera(
      args.documento,
      args.celular,
      args.valor
    );
  }

  @Post('iniciarPago')
  async iniciarPago(@Body() args: { documento: string; valor: number }) {
    return this.billeteraService.iniciarPago(
      args.documento,
      args.valor
    );
  }

  @Post('confirmarPago')
  async confirmarPago(@Body() args: { idSesion: string; token: string }) {
    return this.billeteraService.confirmarPago(
      args.idSesion,
      args.token
    );
  }

  @Post('consultarSaldo')
  async consultarSaldo(@Body() args: { documento: string; celular: string }) {
    return this.billeteraService.consultarSaldo(
      args.documento,
      args.celular
    );
  }
} 