import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BilleteraController } from './controllers/billetera.controller';
import { SoapService } from './services/soap.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [BilleteraController],
  providers: [SoapService],
})
export class AppModule {}
