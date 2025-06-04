import { IsString, IsNotEmpty } from 'class-validator';

export class ConfirmarPagoDto {
  @IsString()
  @IsNotEmpty()
  idSesion: string;

  @IsString()
  @IsNotEmpty()
  token: string;
} 