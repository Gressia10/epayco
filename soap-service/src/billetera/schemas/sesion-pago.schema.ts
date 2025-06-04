import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class SesionPago extends Document {
  @Prop({ required: true, unique: true })
  idSesion: string;

  @Prop({ required: true })
  documento: string;

  @Prop({ required: true })
  valor: number;

  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  fechaExpiracion: Date;

  @Prop({ required: true, default: false })
  confirmado: boolean;
}

export const SesionPagoSchema = SchemaFactory.createForClass(SesionPago); 