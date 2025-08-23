import Pagina from '../models/Pagina.js';
// ==================================================================
// 1. IMPORTAR OS MÓDULOS NECESSÁRIOS
// ==================================================================
import EmailSubscription from '../models/EmailSubscription.js'; // Nosso modelo de e-mails
import { transactionalEmailsApi } from '../config/brevo.js';    // Nossa API do Brevo configurada

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

// Atualizar página por ID
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

    // ==================================================================
    // 2. LÓGICA DE DISPARO DE E-MAIL APÓS ATUALIZAR A PÁGINA
    // ==================================================================
    if (paginaAtualizada.slug === 'home-cronograma') {
      console.log('-> Cronograma atualizado. Iniciando processo de notificação...');

      try {
        const subscriptions = await EmailSubscription.find({});
        
        if (subscriptions.length === 0) {
          console.log('-> Nenhum e-mail encontrado para notificar. Processo encerrado.');
        } else {
          const recipients = subscriptions.map(sub => ({ email: sub.email }));
          console.log(`-> Encontrados ${recipients.length} e-mails. Preparando para enviar...`);

          const sendSmtpEmail = {
            to: recipients,
            subject: 'O Cronograma da Coleta Seletiva foi Atualizado!',
            htmlContent: `
              <html>
                <head>
                  <style>
                    body { font-family: Arial, sans-serif; color: #333; }
                    .container { padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; }
                    .button { padding: 12px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <h1>Olá morador da morada amiga! 👋</h1>
                    <p>O cronograma da coleta seletiva de Assis Chateaubriand foi atualizado em nosso site.</p>
                    <p>Clique no botão abaixo para ver as novidades e conferir os dias de coleta no seu bairro:</p>
                    <p style="text-align: center; margin: 30px 0;">
                      <a href="https://coletareact.vercel.app/#cronograma" class="button">Ver Novo Cronograma</a>
                    </p>
                    <p>A sua colaboração é fundamental para manter nossa cidade limpa e sustentável.</p>
                    <hr>
                    <p style="font-size: 12px; color: #777;">Você está recebendo este e-mail porque se cadastrou para receber notificações do site Coleta Seletiva Assis Chateaubriand.</p>
                  </div>
                </body>
              </html>
            `,
            sender: {
              name: 'Coleta Seletiva Assis Chateaubriand',
              email: '20233017592@estudantes.ifpr.edu.br' 
            }
          };

          // Usando a API do Brevo para enviar o e-mail
          await transactionalEmailsApi.sendTransacEmail(sendSmtpEmail );
          console.log('-> Notificações por e-mail enviadas com sucesso para todos os inscritos!');
        }
      } catch (emailError) {
        // Se o envio de e-mail falhar, o processo principal não para.
        // A atualização da página já foi um sucesso. Apenas registramos o erro do e-mail.
        console.error('!!! ERRO GRAVE AO ENVIAR E-MAILS:', emailError);
      }
    }
    // ==================================================================
    // FIM DA LÓGICA DE DISPARO
    // ==================================================================

    res.json(paginaAtualizada); // A resposta para o front-end é enviada normalmente.

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

    // No Mongoose v6+, `remove()` foi depreciado em favor de `deleteOne()`
    await Pagina.deleteOne({ _id: req.params.id });
    res.json({ message: 'Página deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar página:', error);
    res.status(500).json({ message: 'Erro ao deletar página' });
  }
};