import Pagina from '../models/Pagina.js';
import EmailSubscription from '../models/EmailSubscription.js';
import { transactionalEmailsApi } from '../config/brevo.js';

// Listar todas as páginas (público ou admin)
export const getPaginasPublic = async (req, res) => {
  try {
    const paginas = await Pagina.find({});
    res.json(paginas);
  } catch (error) {
    console.error('Erro ao buscar páginas:', error);
    res.status(500).json({ message: 'Erro ao buscar páginas' });
  }
};

export const getPaginas = async (req, res) => {
  try {
    const paginas = await Pagina.find({});
    res.json(paginas);
  } catch (error) {
    console.error('Erro ao buscar páginas:', error);
    res.status(500).json({ message: 'Erro ao buscar páginas' });
  }
};

// Buscar página por slug
export const getPaginaBySlug = async (req, res) => {
  try {
    const pagina = await Pagina.findOne({ slug: req.params.slug });
    if (!pagina) {
      return res.status(404).json({ message: 'Página não encontrada' });
    }
    
    const paginaResponse = pagina.toObject();
    if ((req.params.slug === 'cronograma' || req.params.slug === 'home-cronograma') && pagina.updatedAt) {
      const dataAtualizacao = new Date(pagina.updatedAt);
      paginaResponse.ultimaAtualizacao = dataAtualizacao.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
    
    res.json(paginaResponse);
  } catch (error) {
    console.error('Erro ao buscar página por slug:', error);
    res.status(500).json({ message: 'Erro ao buscar página' });
  }
};

// Criar uma nova página
export const createPagina = async (req, res) => {
  const { slug, titulo, conteudo, midiaUrl } = req.body;

  if (!slug || !titulo || !conteudo) {
    return res.status(400).json({ message: 'Slug, título e conteúdo são obrigatórios' });
  }

  try {
    const paginaExiste = await Pagina.findOne({ slug });
    if (paginaExiste) {
      return res.status(400).json({ message: 'Slug já está em uso' });
    }

    const novaPagina = new Pagina({
      slug,
      titulo,
      conteudo,
      midiaUrl: midiaUrl || '',
    });

    const paginaCriada = await novaPagina.save();
    res.status(201).json(paginaCriada);
  } catch (error) {
    console.error('Erro ao criar página:', error);
    res.status(500).json({ message: 'Erro ao criar página' });
  }
};

// Buscar página por ID
export const getPaginaById = async (req, res) => {
  try {
    const pagina = await Pagina.findById(req.params.id);
    if (!pagina) {
      return res.status(404).json({ message: 'Página não encontrada' });
    }
    res.json(pagina);
  } catch (error) {
    console.error('Erro ao buscar página por ID:', error);
    res.status(500).json({ message: 'Erro ao buscar página' });
  }
};

// ==================================================================
// ATUALIZAR PÁGINA (COM NOVA LÓGICA DE E-MAIL)
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

    // --- LÓGICA DE DISPARO DE E-MAIL APÓS ATUALIZAR A PÁGINA ---
    if (paginaAtualizada.slug === 'home-cronograma') {
      console.log('-> Cronograma atualizado. Iniciando processo de notificação...');

      try {
        const subscriptions = await EmailSubscription.find({});
        
        if (subscriptions.length === 0) {
          console.log('-> Nenhum e-mail encontrado para notificar. Processo encerrado.');
        } else {
          const recipients = subscriptions.map(sub => ({ email: sub.email }));
          console.log(`-> Encontrados ${recipients.length} e-mails. Preparando para enviar...`);

          // --- TEMPLATE HTML PREMIUM ---
          const htmlContent = `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { margin: 0; padding: 0; background-color: #f4f7f6; font-family: Arial, sans-serif; }
                .container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; }
                .content { padding: 20px 30px 40px 30px; }
                h1 { font-size: 24px; color: #003366; margin-top: 0; }
                p { font-size: 16px; color: #555555; line-height: 1.6; }
                .button { display: inline-block; background-color: #28a745; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; }
                .footer { background-color: #003366; color: #ffffff; padding: 20px 30px; text-align: center; font-size: 12px; }
                .footer a { color: #ffffff; text-decoration: underline; }
              </style>
            </head>
            <body>
              <table class="container" role="presentation" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0; background-color: #003366;">
                    <img src="https://i.imgur.com/URL_DA_SUA_LOGO.png" alt="Logo Coleta Amiga" width="180">
                  </td>
                </tr>
                <tr>
                  <td class="content">
                    <h1>♻️ Novo cronograma disponível!</h1>
                    <p>Olá, morador(a )!</p>
                    <p>Temos novidades importantes: o cronograma da coleta seletiva do seu bairro foi atualizado.</p>
                    <p>✅ Confira os novos dias e horários de coleta clicando no botão abaixo para não perder o dia certo!</p>
                      

                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="center">
                          <a href="https://coletareact.vercel.app/#cronograma" target="_blank" class="button">
                            Ver Cronograma Atualizado
                          </a>
                        </td>
                      </tr>
                    </table>
                      

                    <p style="text-align:center; font-style:italic; color:#0056b3;">Sua atitude faz a diferença 🌱</p>
                  </td>
                </tr>
                <tr>
                  <td class="footer">
                    <p style="margin:0 0 10px 0;">Prefeitura Municipal de Assis Chateaubriand  
Secretaria de Meio Ambiente – Projeto Coleta Amiga</p>
                    <p style="margin:0 0 10px 0;">
                      <a href="https://www.instagram.com/uvr_assis/" target="_blank">Instagram</a> &nbsp;|&nbsp; 
                      <a href="tel:+5544991833010" target="_blank">Telefone</a>
                    </p>
                    <p style="margin:0; font-size: 10px; opacity: 0.7;">
                      Você recebeu este e-mail porque se inscreveu para receber atualizações.
                    </p>
                  </td>
                </tr>
              </table>
            </body>
            </html>
          `;

          const sendSmtpEmail = {
            to: recipients,
            subject: '📢 Cronograma da Coleta Seletiva Atualizado!',
            htmlContent: htmlContent,
            sender: {
              name: 'Coleta Seletiva Assis Chateaubriand',
              email: 'nao-responda@coletaseletivaassis.com.br' // <<< LEMBRE-SE DE USAR UM E-MAIL VALIDADO
            }
          };

          await transactionalEmailsApi.sendTransacEmail(sendSmtpEmail );
          console.log('-> Notificações por e-mail enviadas com sucesso para todos os inscritos!');
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

// Deletar página por ID
export const deletePagina = async (req, res) => {
  try {
    const pagina = await Pagina.findById(req.params.id);

    if (!pagina) {
      return res.status(404).json({ message: 'Página não encontrada' });
    }

    await Pagina.deleteOne({ _id: req.params.id });
    res.json({ message: 'Página deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar página:', error);
    res.status(500).json({ message: 'Erro ao deletar página' });
  }
};
