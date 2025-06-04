import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class RegistroClienteDto {
  @IsString()
  @IsNotEmpty()
  documento: string;

  @IsString()
  @IsNotEmpty()
  nombres: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  celular: string;
} 