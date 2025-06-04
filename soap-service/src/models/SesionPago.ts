import mongoose from 'mongoose';

const sesionPagoSchema = new mongoose.Schema({
  idSesion: {
    type: String,
    required: true,
    unique: true
  },
  documento: {
    type: String,
    required: true
  },
  valor: {
    type: Number,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  confirmado: {
    type: Boolean,
    default: false
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  fechaExpiracion: {
    type: Date,
    required: true
  }
});

export const SesionPago = mongoose.model('SesionPago', sesionPagoSchema); 