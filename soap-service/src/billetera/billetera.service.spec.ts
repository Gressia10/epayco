import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BilleteraService } from './billetera.service';
import { EmailService } from '../email/email.service';
import { Cliente } from './schemas/cliente.schema';
import { SesionPago } from './schemas/sesion-pago.schema';

describe('BilleteraService', () => {
  let service: BilleteraService;
  let clienteModel: Model<Cliente>;
  let sesionPagoModel: Model<SesionPago>;
  let emailService: EmailService;

  const mockClienteModel = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockSesionPagoModel = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockEmailService = {
    enviarToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BilleteraService,
        {
          provide: getModelToken(Cliente.name),
          useValue: mockClienteModel,
        },
        {
          provide: getModelToken(SesionPago.name),
          useValue: mockSesionPagoModel,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    service = module.get<BilleteraService>(BilleteraService);
    clienteModel = module.get<Model<Cliente>>(getModelToken(Cliente.name));
    sesionPagoModel = module.get<Model<SesionPago>>(getModelToken(SesionPago.name));
    emailService = module.get<EmailService>(EmailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registroCliente', () => {
    it('debería registrar un nuevo cliente exitosamente', async () => {
      const clienteData = {
        documento: '123456789',
        nombres: 'Juan Pérez',
        email: 'juan@example.com',
        celular: '3001234567',
      };

      mockClienteModel.findOne.mockResolvedValue(null);
      mockClienteModel.create.mockReturnValue({
        ...clienteData,
        saldo: 0,
        save: jest.fn().mockResolvedValue({ ...clienteData, saldo: 0 }),
      });

      const result = await service.registroCliente(
        clienteData.documento,
        clienteData.nombres,
        clienteData.email,
        clienteData.celular,
      );

      expect(result).toContain('<success>true</success>');
      expect(result).toContain('<cod_error>00</cod_error>');
    });

    it('debería retornar error si el cliente ya existe', async () => {
      const clienteData = {
        documento: '123456789',
        nombres: 'Juan Pérez',
        email: 'juan@example.com',
        celular: '3001234567',
      };

      mockClienteModel.findOne.mockResolvedValue(clienteData);

      const result = await service.registroCliente(
        clienteData.documento,
        clienteData.nombres,
        clienteData.email,
        clienteData.celular,
      );

      expect(result).toContain('<success>false</success>');
      expect(result).toContain('<cod_error>01</cod_error>');
    });
  });

  describe('recargarBilletera', () => {
    it('debería recargar la billetera exitosamente', async () => {
      const clienteData = {
        documento: '123456789',
        celular: '3001234567',
        saldo: 1000,
        save: jest.fn(),
      };

      mockClienteModel.findOne.mockResolvedValue(clienteData);

      const result = await service.recargarBilletera(
        clienteData.documento,
        clienteData.celular,
        500,
      );

      expect(result).toContain('<success>true</success>');
      expect(result).toContain('<cod_error>00</cod_error>');
      expect(clienteData.saldo).toBe(1500);
    });

    it('debería retornar error si el cliente no existe', async () => {
      mockClienteModel.findOne.mockResolvedValue(null);

      const result = await service.recargarBilletera(
        '123456789',
        '3001234567',
        500,
      );

      expect(result).toContain('<success>false</success>');
      expect(result).toContain('<cod_error>03</cod_error>');
    });
  });

  describe('iniciarPago', () => {
    it('debería iniciar el pago exitosamente', async () => {
      const clienteData = {
        documento: '123456789',
        saldo: 1000,
      };

      mockClienteModel.findOne.mockResolvedValue(clienteData);
      mockEmailService.enviarToken.mockResolvedValue(true);
      mockSesionPagoModel.create.mockReturnValue({
        save: jest.fn().mockResolvedValue({ idSesion: '123' }),
      });

      const result = await service.iniciarPago(
        clienteData.documento,
        500,
      );

      expect(result).toContain('<success>true</success>');
      expect(result).toContain('<cod_error>00</cod_error>');
    });

    it('debería retornar error si el saldo es insuficiente', async () => {
      const clienteData = {
        documento: '123456789',
        saldo: 100,
      };

      mockClienteModel.findOne.mockResolvedValue(clienteData);

      const result = await service.iniciarPago(
        clienteData.documento,
        500,
      );

      expect(result).toContain('<success>false</success>');
      expect(result).toContain('<cod_error>05</cod_error>');
    });
  });
}); 