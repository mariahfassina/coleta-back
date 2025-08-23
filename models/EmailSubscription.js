// Arquivo: models/EmailSubscription.js

import mongoose from 'mongoose'; // Use import

const EmailSubscriptionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    // Regex simples para validação de e-mail
    match: [/.+\@.+\..+/, 'Por favor, insira um e-mail válido']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Crie o modelo
const EmailSubscription = mongoose.model('EmailSubscription', EmailSubscriptionSchema);

// Exporte o modelo como padrão
export default EmailSubscription; // <<<--- A CORREÇÃO PRINCIPAL ESTÁ AQUI
