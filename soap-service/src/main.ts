import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as soap from 'soap';
import * as fs from 'fs';
import * as path from 'path';
import { BilleteraService } from './billetera/billetera.service';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const billeteraService = app.get(BilleteraService);
  const configService = app.get(ConfigService);

  // Leer el archivo WSDL
  const wsdl = fs.readFileSync(path.join(__dirname, '..', 'billetera.wsdl'), 'utf8');

  // Definir el servicio SOAP según el WSDL
  const service = {
    BilleteraService: {
      BilleteraServiceSoap: {
        registroCliente: async (args: any) => {
          return billeteraService.registroCliente(
            args.documento,
            args.nombres,
            args.email,
            args.celular
          );
        },
        recargarBilletera: async (args: any) => {
          return billeteraService.recargarBilletera(
            args.documento,
            args.celular,
            args.valor
          );
        },
        iniciarPago: async (args: any) => {
          return billeteraService.iniciarPago(
            args.documento,
            args.valor
          );
        },
        confirmarPago: async (args: any) => {
          return billeteraService.confirmarPago(
            args.idSesion,
            args.token
          );
        },
        consultarSaldo: async (args: any) => {
          return billeteraService.consultarSaldo(
            args.documento,
            args.celular
          );
        }
      }
    }
  };

  // Crear el servidor SOAP
  soap.listen(app.getHttpServer(), '/billetera', service, wsdl);

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
  console.log(`Servicio SOAP ejecutándose en: http://localhost:${port}/billetera?wsdl`);
}
bootstrap();
