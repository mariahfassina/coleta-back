// controllers/paginaController.js (VERSÃO FINAL E CORRIGIDA)

import Pagina from '../models/Pagina.js';
import EmailSubscription from '../models/EmailSubscription.js';
// 1. VAMOS IMPORTAR A BIBLIOTECA PRINCIPAL DIRETAMENTE AQUI
import SibApiV3Sdk from 'sib-api-v3-sdk';

// ... (todas as suas outras funções como getPaginas, createPagina, etc., continuam iguais)

export const getPaginasPublic = async (req, res) => { /* ... seu código ... */ };
export const getPaginas = async (req, res) => { /* ... seu código ... */ };
export const getPaginaBySlug = async (req, res) => { /* ... seu código ... */ };
export const createPagina = async (req, res) => { /* ... seu código ... */ };
export const getPaginaById = async (req, res) => { /* ... seu código ... */ };

// ==================================================================
// ATUALIZAR PÁGINA (COM A CORREÇÃO FINAL)
// ==================================================================
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

          // 2. Criamos uma nova instância da API aqui dentro
          const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
          
          // 3. Pegamos a chave de API direto do process.env (que o Render vai fornecer)
          const apiKey = apiInstance.authentications['api-key'];
          apiKey.apiKey = process.env.BREVO_API_KEY;

          // 4. Montamos o e-mail
          const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
          sendSmtpEmail.to = recipients;
          sendSmtpEmail.subject = '📢 Cronograma da Coleta Seletiva Atualizado!';
          sendSmtpEmail.htmlContent = `
            <!DOCTYPE html>
            <html>
              <body>
                <p>O cronograma foi atualizado! Confira em nosso site.</p>
                <a href="https://coletareact.vercel.app/#cronograma">Ver Novo Cronograma</a>
              </body>
            </html>
          `; // (Use seu template HTML completo aqui )
          sendSmtpEmail.sender = {
            name: 'Coleta Seletiva Assis Chateaubriand',
            email: 'nao-responda@coletaseletivaassis.com.br' // Use seu remetente validado
          };

          // 5. Enviamos o e-mail usando a instância
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
export const deletePagina = async (req, res) => { /* ... seu código ... */ };
