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
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor, adicione um email válido',
    ],
  },
  password: {
    type: String,
    required: [true, 'Por favor, adicione uma senha'],
    minlength: 6,
    select: false,
  },
  needsPasswordChange: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// 2. Middleware para criptografar a senha ANTES de salvar
adminSchema.pre('save', async function(next) {
  // Se a senha NÃO foi modificada, pula para o próximo middleware
  if (!this.isModified('password')) {
    return next();
  }

  // Se modificada, gera o salt e criptografa a senha
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next(); // importante chamar next() para continuar o fluxo
});

// 3. Método para comparar senha digitada com a senha armazenada
adminSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 4. Exporta o model
export default mongoose.model('Admin', adminSchema);

