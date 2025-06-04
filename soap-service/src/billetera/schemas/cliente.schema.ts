import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Cliente extends Document {
  @Prop({ required: true, unique: true })
  documento: string;

  @Prop({ required: true })
  nombres: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  celular: string;

  @Prop({ required: true, default: 0 })
  saldo: number;
}

export const ClienteSchema = SchemaFactory.createForClass(Cliente); 