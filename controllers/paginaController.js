// controllers/paginaController.js (VERSÃO FINALÍSSIMA)

import Pagina from '../models/Pagina.js';
import EmailSubscription from '../models/EmailSubscription.js';
import SibApiV3Sdk from 'sib-api-v3-sdk';

// ... (todas as suas outras funções continuam exatamente iguais)
export const getPaginasPublic = async (req, res) => { /* ... */ };
export const getPaginas = async (req, res) => { /* ... */ };
export const getPaginaBySlug = async (req, res) => { /* ... */ };
export const createPagina = async (req, res) => { /* ... */ };
export const getPaginaById = async (req, res) => { /* ... */ };

// ========================================================
// FUNÇÃO UPDATEPAGINA (COM A CORREÇÃO DO CLIENTE PADRÃO)
// ========================================================
export const updatePagina = async (req, res) => {
  try {
    const pagina = await Pagina.findById(req.params.id);
    if (!pagina) {
      return res.status(404).json({ message: 'Página não encontrada' });
    }

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
        if (subscriptions.length === 0) {
          console.log('-> Nenhum e-mail encontrado para notificar.');
        } else {
          const recipients = subscriptions.map(sub => ({ email: sub.email }));
          console.log(`-> Encontrados ${recipients.length} e-mails. Preparando para enviar...`);

          // --- A CORREÇÃO DEFINITIVA ESTÁ AQUI ---

          // 1. Inicializamos o cliente padrão da SDK. ESTA É A LINHA QUE FALTAVA.
          let defaultClient = SibApiV3Sdk.ApiClient.instance;

          // 2. Pegamos a referência da autenticação 'api-key' a partir do cliente padrão.
          let apiKey = defaultClient.authentications['api-key'];
          apiKey.apiKey = process.env.BREVO_API_KEY;

          // 3. Criamos a instância da API.
          let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

          // 4. Montamos o e-mail.
          let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
          sendSmtpEmail.to = recipients;
          sendSmtpEmail.subject = '📢 Cronograma da Coleta Seletiva Atualizado!';
          sendSmtpEmail.htmlContent = `... seu template HTML aqui ...`;
          sendSmtpEmail.sender = {
            name: 'Coleta Seletiva Assis Chateaubriand',
            email: 'nao-responda@coletaseletivaassis.com.br'
          };

          // 5. Enviamos o e-mail.
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

// ... (sua função deletePagina continua igual)
export const deletePagina = async (req, res) => { /* ... */ };
