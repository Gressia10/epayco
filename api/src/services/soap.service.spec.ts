import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { SoapService } from './soap.service';
import * as soap from 'soap';

jest.mock('soap');

describe('SoapService', () => {
  let service: SoapService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'SOAP_URL') return 'http://localhost:3000/billetera?wsdl';
      return null;
    }),
  };

  const mockSoapClient = {
    registroClienteAsync: jest.fn(),
  };

  beforeEach(async () => {
    (soap.createClientAsync as jest.Mock).mockResolvedValue(mockSoapClient);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SoapService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<SoapService>(SoapService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('registrarCliente', () => {
    it('debería registrar un cliente exitosamente', async () => {
      const mockResponse = {
        return: {
          success: true,
          cod_error: '0',
          message_error: '',
          data: {
            id: '123',
            documento: '123456789',
            nombres: 'Test User',
            email: 'test@example.com',
            celular: '3001234567',
          },
        },
      };

      mockSoapClient.registroClienteAsync.mockResolvedValue([mockResponse]);

      const result = await service.registrarCliente({
        documento: '123456789',
        nombres: 'Test User',
        email: 'test@example.com',
        celular: '3001234567',
      });

      expect(result).toEqual({
        success: true,
        cod_error: '0',
        message_error: '',
        data: mockResponse.return.data,
      });
    });
  });
}); 