// Arquivo: controllers/emailController.js

import EmailSubscription from '../models/EmailSubscription.js';

export const subscribeEmail = async (req, res) => { // <<<--- O "export" aqui é importante
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'O e-mail é obrigatório.' });
    }

    const existingSubscription = await EmailSubscription.findOne({ email });
    if (existingSubscription) {
      return res.status(409).json({ success: false, message: 'Este e-mail já está cadastrado.' });
    }

    const newSubscription = await EmailSubscription.create({ email });

    res.status(201).json({
      success: true,
      message: 'Inscrição realizada com sucesso!',
      data: newSubscription,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
        return res.status(400).json({ success: false, message: error.message });
    }
    console.error('Erro ao inscrever e-mail:', error);
    res.status(500).json({ success: false, message: 'Erro no servidor ao processar a inscrição.' });
  }
};
