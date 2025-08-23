// config/db.js

import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Tenta se conectar ao MongoDB usando a URI do arquivo .env
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    // Se a conexão for bem-sucedida, imprime uma mensagem no console
    console.log(`MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    // Se a conexão falhar, imprime o erro e encerra o processo do servidor
    console.error(`Erro ao conectar ao MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;