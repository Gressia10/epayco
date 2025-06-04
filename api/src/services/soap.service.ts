import { Injectable } from '@nestjs/common';
import * as soap from 'soap';
import { ConfigService } from '@nestjs/config';
import { promisify } from 'util';
import { parseString } from 'xml2js';
import { ApiResponse } from '../interfaces/api-response.interface';

interface XmlResponse {
  response: {
    success: string[];
    cod_error: string[];
    message_error: string[];
    data: string[];
  };
}

@Injectable()
export class SoapService {
  private client: any;

  constructor(private configService: ConfigService) {
    this.initializeClient();
  }

  private async initializeClient() {
    try {
      const soapUrl = this.configService.get<string>('SOAP_URL');
      console.log('URL del servicio SOAP:', soapUrl);
      
      if (!soapUrl) {
        throw new Error('SOAP_URL no está configurada en las variables de entorno');
      }

      const createClientAsync = promisify(soap.createClient);
      this.client = await createClientAsync(soapUrl);
      console.log('Cliente SOAP inicializado correctamente');
    } catch (error) {
      console.error('Error al inicializar el cliente SOAP:', error);
      throw error;
    }
  }

  private async callSoapMethod(methodName: string, args: any): Promise<ApiResponse> {
    try {
      console.log('Llamando al método SOAP:', methodName);
      console.log(this.configService.get<string>('SOAP_URL'))
      console.log('Argumentos:', args);

      if (!this.client) {
        console.log('Cliente SOAP no inicializado, intentando inicializar...');
        await this.initializeClient();
      }

      const methodAsync = promisify(this.client[methodName]);
      console.log('Enviando petición SOAP...');
      const xmlResponse = await methodAsync(args);
      console.log('Respuesta XML del servicio SOAP:', xmlResponse);
      
      // Convertir XML a JSON
      const parseXmlAsync = promisify(parseString);
      const jsonResponse = await parseXmlAsync(xmlResponse) as XmlResponse;
      console.log('Respuesta JSON parseada:', jsonResponse);
      
      // Extraer los datos de la respuesta
      const response = jsonResponse.response;
      const result = {
        success: response.success[0] === 'true',
        cod_error: response.cod_error[0],
        message_error: response.message_error[0] || '',
        data: response.data[0] ? JSON.parse(response.data[0]) : null
      };
      
      console.log('Respuesta procesada:', result);
      return result;
    } catch (error) {
      console.error('Error en la llamada al método SOAP:', error);
      if (error.code === 'ECONNREFUSED') {
        return {
          success: false,
          cod_error: 'ERR01',
          message_error: 'No se pudo conectar al servicio SOAP. Verifique que el servicio esté ejecutándose en el puerto 3000.',
          data: null
        };
      }
      return {
        success: false,
        cod_error: 'ERR01',
        message_error: `Error en la comunicación con el servicio SOAP: ${error.message}`,
        data: null
      };
    }
  }

  async registrarCliente(datos: any): Promise<ApiResponse> {
    console.log('Registrando cliente:', datos);
    return this.callSoapMethod('registroCliente', datos);
  }

  async recargarBilletera(datos: any): Promise<ApiResponse> {
    console.log('Recargando billetera:', datos);
    return this.callSoapMethod('recargarBilletera', datos);
  }

  async iniciarPago(datos: any): Promise<ApiResponse> {
    console.log('Iniciando pago:', datos);
    return this.callSoapMethod('iniciarPago', datos);
  }

  async confirmarPago(datos: any): Promise<ApiResponse> {
    console.log('Confirmando pago:', datos);
    return this.callSoapMethod('confirmarPago', datos);
  }

  async consultarSaldo(datos: any): Promise<ApiResponse> {
    console.log('Consultando saldo:', datos);
    return this.callSoapMethod('consultarSaldo', datos);
  }
} 