import { Module } from '@nestjs/common';
import { BilleteraService } from './billetera.service';
import { BilleteraController } from './billetera.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cliente, ClienteSchema } from './schemas/cliente.schema';
import { SesionPago, SesionPagoSchema } from './schemas/sesion-pago.schema';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cliente.name, schema: ClienteSchema },
      { name: SesionPago.name, schema: SesionPagoSchema },
    ]),
    EmailModule,
  ],
  controllers: [BilleteraController],
  providers: [BilleteraService],
})
export class BilleteraModule {} 