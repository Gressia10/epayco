import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';

export class IniciarPagoDto {
  @IsString()
  @IsNotEmpty()
  documento: string;

  @IsNumber()
  @Min(0)
  valor: number;
} 