import { Test, TestingModule } from '@nestjs/testing';
import { BilleteraController } from './billetera.controller';
import { SoapService } from '../services/soap.service';

describe('BilleteraController', () => {
  let controller: BilleteraController;
  let soapService: SoapService;

  const mockSoapService = {
    registrarCliente: jest.fn(),
    recargarBilletera: jest.fn(),
    iniciarPago: jest.fn(),
    confirmarPago: jest.fn(),
    consultarSaldo: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BilleteraController],
      providers: [
        {
          provide: SoapService,
          useValue: mockSoapService,
        },
      ],
    }).compile();

    controller = module.get<BilleteraController>(BilleteraController);
    soapService = module.get<SoapService>(SoapService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registroCliente', () => {
    it('debería registrar un cliente exitosamente', async () => {
      const mockResponse = {
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
      };

      mockSoapService.registrarCliente.mockResolvedValue(mockResponse);

      const result = await controller.registroCliente({
        documento: '123456789',
        nombres: 'Test User',
        email: 'test@example.com',
        celular: '3001234567',
      });

      expect(result).toEqual(mockResponse);
      expect(soapService.registrarCliente).toHaveBeenCalledWith({
        documento: '123456789',
        nombres: 'Test User',
        email: 'test@example.com',
        celular: '3001234567',
      });
    });
  });

  describe('recargarBilletera', () => {
    it('debería recargar la billetera exitosamente', async () => {
      const mockResponse = {
        success: true,
        cod_error: '0',
        message_error: '',
        data: {
          saldo: 1000,
        },
      };

      mockSoapService.recargarBilletera.mockResolvedValue(mockResponse);

      const result = await controller.recargarBilletera({
        documento: '123456789',
        celular: '3001234567',
        valor: 1000,
      });

      expect(result).toEqual(mockResponse);
      expect(soapService.recargarBilletera).toHaveBeenCalledWith({
        documento: '123456789',
        celular: '3001234567',
        valor: 1000,
      });
    });
  });

  describe('iniciarPago', () => {
    it('debería iniciar un pago exitosamente', async () => {
      const mockResponse = {
        success: true,
        cod_error: '0',
        message_error: '',
        data: {
          idSesion: 'session123',
        },
      };

      mockSoapService.iniciarPago.mockResolvedValue(mockResponse);

      const result = await controller.iniciarPago({
        documento: '123456789',
        valor: 500,
      });

      expect(result).toEqual(mockResponse);
      expect(soapService.iniciarPago).toHaveBeenCalledWith({
        documento: '123456789',
        valor: 500,
      });
    });
  });
}); 