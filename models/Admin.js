// models/Admin.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// 1. Definindo o Schema (a estrutura dos dados)
const adminSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Por favor, adicione um nome'],
  },
  email: {
    type: String,
    required: [true, 'Por favor, adicione um email'],
    unique: true, // Garante que cada email seja único no banco de dados
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, // Validação simples de formato de email
      'Por favor, adicione um email válido',
    ],
  },
  password: {
    type: String,
    required: [true, 'Por favor, adicione uma senha'],
    minlength: 6, // Senha deve ter no mínimo 6 caracteres
    select: false, // Por padrão, a senha não será retornada quando buscarmos um admin
  },
}, {
  // Adiciona os campos createdAt e updatedAt automaticamente
  timestamps: true 
});

// 2. Middleware (Hook) para Criptografar a Senha ANTES de salvar
// A função 'pre' define uma ação que acontece antes do evento 'save'
adminSchema.pre('save', async function(next) {
  // Se a senha não foi modificada (ex: atualização do nome), não faz nada
  if (!this.isModified('password')) {
    next();
  }

  // Gera um "salt" para fortalecer a criptografia
  const salt = await bcrypt.genSalt(10);
  // Criptografa a senha e a substitui no documento
  this.password = await bcrypt.hash(this.password, salt);
});

// 3. Método para comparar a senha digitada com a senha do banco
// Vamos adicionar este método ao nosso schema para poder usar em qualquer documento de Admin
adminSchema.methods.matchPassword = async function(enteredPassword) {
  // Compara a senha digitada com a senha criptografada (this.password)
  return await bcrypt.compare(enteredPassword, this.password);
};

// 4. Exporta o Model
// O Mongoose vai criar uma coleção chamada 'admins' no MongoDB com base neste schema
export default mongoose.model('Admin', adminSchema);
