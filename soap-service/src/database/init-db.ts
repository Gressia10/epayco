import { MongoClient } from 'mongodb';
import { config } from 'dotenv';

config();

async function initDatabase() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/billetera';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Conectado a MongoDB');

    const db = client.db();

    // Crear colección de clientes
    await db.createCollection('clientes', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['documento', 'nombres', 'email', 'celular', 'saldo'],
          properties: {
            documento: {
              bsonType: 'string',
              description: 'Documento de identidad del cliente'
            },
            nombres: {
              bsonType: 'string',
              description: 'Nombres del cliente'
            },
            email: {
              bsonType: 'string',
              pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
              description: 'Email del cliente'
            },
            celular: {
              bsonType: 'string',
              description: 'Número de celular del cliente'
            },
            saldo: {
              bsonType: 'number',
              minimum: 0,
              description: 'Saldo actual de la billetera'
            }
          }
        }
      }
    });

    // Crear índices únicos para clientes
    await db.collection('clientes').createIndex({ documento: 1 }, { unique: true });
    await db.collection('clientes').createIndex({ email: 1 }, { unique: true });
    await db.collection('clientes').createIndex({ celular: 1 }, { unique: true });

    // Crear colección de sesiones de pago
    await db.createCollection('sesionpagos', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['idSesion', 'documento', 'valor', 'token', 'fechaExpiracion', 'confirmado'],
          properties: {
            idSesion: {
              bsonType: 'string',
              description: 'Identificador único de la sesión'
            },
            documento: {
              bsonType: 'string',
              description: 'Documento del cliente'
            },
            valor: {
              bsonType: 'number',
              minimum: 0,
              description: 'Valor del pago'
            },
            token: {
              bsonType: 'string',
              description: 'Token de confirmación'
            },
            fechaExpiracion: {
              bsonType: 'date',
              description: 'Fecha de expiración del token'
            },
            confirmado: {
              bsonType: 'bool',
              description: 'Estado de confirmación del pago'
            }
          }
        }
      }
    });

    // Crear índice único para idSesion
    await db.collection('sesionpagos').createIndex({ idSesion: 1 }, { unique: true });

    console.log('Base de datos inicializada correctamente');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    throw error;
  } finally {
    await client.close();
  }
}

initDatabase().catch(console.error); 