// controllers/emailController.js (Versão com Mensagem de Erro Limpa)

import EmailSubscription from '../models/EmailSubscription.js';

export const subscribeEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'O e-mail é obrigatório.' });
    }

    const existingSubscription = await EmailSubscription.findOne({ email });
    if (existingSubscription) {
      return res.status(409).json({ success: false, message: 'Este e-mail já está cadastrado! Por favor insira outro e-mail válido.' });
    }

    const newSubscription = await EmailSubscription.create({ email });

    res.status(201).json({
      success: true,
      message: 'Inscrição realizada com sucesso!',
      data: newSubscription,
    });
  } catch (error) {

    if (error.name === 'ValidationError') {
      const friendlyMessage = error.errors.email ? error.errors.email.message : 'Dados inválidos.';
      return res.status(400).json({ success: false, message: friendlyMessage });
    }

    console.error('Erro ao inscrever e-mail:', error);
    res.status(500).json({ success: false, message: 'Erro no servidor ao processar a inscrição.' });
  }
};
