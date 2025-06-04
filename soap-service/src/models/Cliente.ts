import mongoose from 'mongoose';

const clienteSchema = new mongoose.Schema({
  documento: {
    type: String,
    required: true,
    unique: true
  },
  nombres: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  celular: {
    type: String,
    required: true,
    unique: true
  },
  saldo: {
    type: Number,
    default: 0
  }
});

export const Cliente = mongoose.model('Cliente', clienteSchema); 