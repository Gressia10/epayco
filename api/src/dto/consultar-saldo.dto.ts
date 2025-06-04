import { IsString, IsNotEmpty } from 'class-validator';

export class ConsultarSaldoDto {
  @IsString()
  @IsNotEmpty()
  documento: string;

  @IsString()
  @IsNotEmpty()
  celular: string;
} 