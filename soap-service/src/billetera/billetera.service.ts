import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cliente } from './schemas/cliente.schema';
import { SesionPago } from './schemas/sesion-pago.schema';
import { EmailService } from '../email/email.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BilleteraService {
  constructor(
    @InjectModel(Cliente.name) private clienteModel: Model<Cliente>,
    @InjectModel(SesionPago.name) private sesionPagoModel: Model<SesionPago>,
    private emailService: EmailService,
  ) {}

  private createXmlResponse(success: boolean, codError: string, messageError: string | null, data: any | null): string {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<response>
  <success>${success}</success>
  <cod_error>${codError}</cod_error>
  <message_error>${messageError || ''}</message_error>
  <data>${data ? JSON.stringify(data) : ''}</data>
</response>`;
    return xml;
  }

  async registroCliente(documento: string, nombres: string, email: string, celular: string) {
    try {
      const clienteExistente = await this.clienteModel.findOne({
        $or: [{ documento }, { email }, { celular }]
      });

      if (clienteExistente) {
        return this.createXmlResponse(
          false,
          "01",
          "El cliente ya existe con ese documento, email o celular",
          null
        );
      }

      const nuevoCliente = new this.clienteModel({
        documento,
        nombres,
        email,
        celular,
        saldo: 0
      });

      await nuevoCliente.save();

      return this.createXmlResponse(
        true,
        "00",
        null,
        nuevoCliente
      );
    } catch (error) {
      return this.createXmlResponse(
        false,
        "02",
        "Error al registrar el cliente",
        null
      );
    }
  }

  async recargarBilletera(documento: string, celular: string, valor: number) {
    try {
      const cliente = await this.clienteModel.findOne({ documento, celular });
      
      if (!cliente) {
        return this.createXmlResponse(
          false,
          "03",
          "Cliente no encontrado",
          null
        );
      }

      cliente.saldo += valor;
      await cliente.save();

      return this.createXmlResponse(
        true,
        "00",
        null,
        { saldo: cliente.saldo }
      );
    } catch (error) {
      return this.createXmlResponse(
        false,
        "04",
        "Error al recargar la billetera",
        null
      );
    }
  }

  async iniciarPago(documento: string, valor: number) {
    try {
      const cliente = await this.clienteModel.findOne({ documento });
      
      if (!cliente) {
        return this.createXmlResponse(
          false,
          "03",
          "Cliente no encontrado",
          null
        );
      }

      if (cliente.saldo < valor) {
        return this.createXmlResponse(
          false,
          "05",
          "Saldo insuficiente",
          null
        );
      }

      const token = Math.floor(100000 + Math.random() * 900000).toString();
      const idSesion = uuidv4();
      const fechaExpiracion = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos

      const sesionPago = new this.sesionPagoModel({
        idSesion,
        documento,
        valor,
        token,
        fechaExpiracion
      });

      await sesionPago.save();

      const emailEnviado = await this.emailService.enviarToken(cliente.email, token);

      if (!emailEnviado) {
        return this.createXmlResponse(
          false,
          "06",
          "Error al enviar el token por correo",
          null
        );
      }

      return this.createXmlResponse(
        true,
        "00",
        null,
        { idSesion }
      );
    } catch (error) {
      console.log(error)
      return this.createXmlResponse(
        false,
        "07",
        "Error al iniciar el pago",
        null
      );
    }
  }

  async confirmarPago(idSesion: string, token: string) {
    try {
      const sesion = await this.sesionPagoModel.findOne({ idSesion });
      
      if (!sesion) {
        return this.createXmlResponse(
          false,
          "08",
          "Sesión no encontrada",
          null
        );
      }

      if (sesion.confirmado) {
        return this.createXmlResponse(
          false,
          "09",
          "La sesión ya fue confirmada",
          null
        );
      }

      if (sesion.token !== token) {
        return this.createXmlResponse(
          false,
          "10",
          "Token inválido",
          null
        );
      }

      if (new Date() > sesion.fechaExpiracion) {
        return this.createXmlResponse(
          false,
          "11",
          "La sesión ha expirado",
          null
        );
      }

      const cliente = await this.clienteModel.findOne({ documento: sesion.documento });
      
      if (!cliente) {
        return this.createXmlResponse(
          false,
          "03",
          "Cliente no encontrado",
          null
        );
      }

      if (cliente.saldo < sesion.valor) {
        return this.createXmlResponse(
          false,
          "05",
          "Saldo insuficiente",
          null
        );
      }

      cliente.saldo -= sesion.valor;
      await cliente.save();

      sesion.confirmado = true;
      await sesion.save();

      return this.createXmlResponse(
        true,
        "00",
        null,
        { saldo: cliente.saldo }
      );
    } catch (error) {
      return this.createXmlResponse(
        false,
        "12",
        "Error al confirmar el pago",
        null
      );
    }
  }

  async consultarSaldo(documento: string, celular: string) {
    try {
      const cliente = await this.clienteModel.findOne({ documento, celular });
      
      if (!cliente) {
        return this.createXmlResponse(
          false,
          "03",
          "Cliente no encontrado",
          null
        );
      }

      return this.createXmlResponse(
        true,
        "00",
        null,
        { saldo: cliente.saldo }
      );
    } catch (error) {
      return this.createXmlResponse(
        false,
        "13",
        "Error al consultar el saldo",
        null
      );
    }
  }
} 