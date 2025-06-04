import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';

export class RecargarBilleteraDto {
  @IsString()
  @IsNotEmpty()
  documento: string;

  @IsString()
  @IsNotEmpty()
  celular: string;

  @IsNumber()
  @Min(0)
  valor: number;
} 