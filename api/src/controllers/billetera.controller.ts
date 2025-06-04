import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { SoapService } from '../services/soap.service';
import { RegistroClienteDto } from '../dto/registro-cliente.dto';
import { RecargarBilleteraDto } from '../dto/recargar-billetera.dto';
import { IniciarPagoDto } from '../dto/iniciar-pago.dto';
import { ConfirmarPagoDto } from '../dto/confirmar-pago.dto';
import { ConsultarSaldoDto } from '../dto/consultar-saldo.dto';
import { ApiResponse } from '../interfaces/api-response.interface';

@Controller('billetera')
export class BilleteraController {
  constructor(private readonly soapService: SoapService) {}

  @Post('registroCliente')
  async registroCliente(@Body() dto: RegistroClienteDto): Promise<ApiResponse> {
    try {
      return await this.soapService.registrarCliente({
        documento: dto.documento,
        nombres: dto.nombres,
        email: dto.email,
        celular: dto.celular
      });
    } catch (error) {
      throw new HttpException(
        'Error al registrar el cliente',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('recargarBilletera')
  async recargarBilletera(@Body() dto: RecargarBilleteraDto): Promise<ApiResponse> {
    try {
      return await this.soapService.recargarBilletera({
        documento: dto.documento,
        celular: dto.celular,
        valor: dto.valor
      });
    } catch (error) {
      throw new HttpException(
        'Error al recargar la billetera',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('iniciarPago')
  async iniciarPago(@Body() dto: IniciarPagoDto): Promise<ApiResponse> {
    try {
      return await this.soapService.iniciarPago({
        documento: dto.documento,
        valor: dto.valor
      });
    } catch (error) {
      throw new HttpException(
        'Error al iniciar el pago',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('confirmarPago')
  async confirmarPago(@Body() dto: ConfirmarPagoDto): Promise<ApiResponse> {
    try {
      return await this.soapService.confirmarPago({
        idSesion: dto.idSesion,
        token: dto.token
      });
    } catch (error) {
      throw new HttpException(
        'Error al confirmar el pago',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('consultarSaldo')
  async consultarSaldo(@Body() dto: ConsultarSaldoDto): Promise<ApiResponse> {
    try {
      return await this.soapService.consultarSaldo({
        documento: dto.documento,
        celular: dto.celular
      });
    } catch (error) {
      throw new HttpException(
        'Error al consultar el saldo',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
} 