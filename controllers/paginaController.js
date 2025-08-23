// controllers/paginaController.js (COMPLETO E COM A LÓGICA CORRETA)

import Pagina from '../models/Pagina.js';
import EmailSubscription from '../models/EmailSubscription.js';
// Importamos a biblioteca que foi exportada pelo brevo.js
import SibApiV3Sdk from '../config/brevo.js';

// ... (suas outras funções como getPaginas, etc., continuam iguais)
export const getPaginasPublic = async (req, res) => { /* ... */ };
export const getPaginas = async (req, res) => { /* ... */ };
export const getPaginaBySlug = async (req, res) => { /* ... */ };
export const createPagina = async (req, res) => { /* ... */ };
export const getPaginaById = async (req, res) => { /* ... */ };

export const updatePagina = async (req, res) => {
  try {
    const pagina = await Pagina.findById(req.params.id);
    if (!pagina) return res.status(404).json({ message: 'Página não encontrada' });

    const { slug, titulo, conteudo, midiaUrl } = req.body;
    if (slug) pagina.slug = slug;
    if (titulo) pagina.titulo = titulo;
    if (conteudo) pagina.conteudo = conteudo;
    if (midiaUrl !== undefined) pagina.midiaUrl = midiaUrl;

    const paginaAtualizada = await pagina.save();

    if (paginaAtualizada.slug === 'home-cronograma') {
      console.log('-> Cronograma atualizado. Iniciando processo de notificação...');
      try {
        const subscriptions = await EmailSubscription.find({});
        if (subscriptions.length > 0) {
          const recipients = subscriptions.map(sub => ({ email: sub.email }));
          console.log(`-> Encontrados ${recipients.length} e-mails. Preparando para enviar...`);

          const defaultClient = SibApiV3Sdk.ApiClient.instance;
          const apiKey = defaultClient.authentications['api-key'];
          apiKey.apiKey = process.env.BREVO_API_KEY;

          const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
          const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
          
          sendSmtpEmail.to = recipients;
          sendSmtpEmail.subject = '📢 Cronograma da Coleta Seletiva Atualizado!';
          sendSmtpEmail.htmlContent = `... seu template HTML aqui ...`;
          sendSmtpEmail.sender = {
            name: 'Coleta Seletiva Assis Chateaubriand',
            email: '20233017592@estudantes.ifpr.edu.br'
          };

          await apiInstance.sendTransacEmail(sendSmtpEmail);
          console.log('-> Notificações por e-mail enviadas com sucesso!');
        }
      } catch (emailError) {
        console.error('!!! ERRO GRAVE AO ENVIAR E-MAILS:', emailError);
      }
    }
    
    res.json(paginaAtualizada);
  } catch (error) {
    console.error('Erro ao atualizar página:', error);
    res.status(500).json({ message: 'Erro ao atualizar página' });
  }
};

export const deletePagina = async (req, res) => { /* ... */ };

