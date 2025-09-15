import Pagina from '../models/Pagina.js';
import SibApiV3Sdk from 'sib-api-v3-sdk'; // Dependência para enviar e-mails
import EmailSubscription from '../models/EmailSubscription.js'; // Modelo para buscar os e-mails dos inscritos

// ===========================
// FUNÇÃO DE NORMALIZAÇÃO DE SLUG
// ===========================
const normalizeSlug = (slug) => {
  if (!slug) return '';
  return slug
    .normalize('NFC')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .trim();
};

// ===========================
// LÓGICA DE ENVIO DE E-MAIL (FUNÇÃO AUXILIAR)
// ===========================
const enviarNotificacaoDeCronograma = async () => {
  try {
    console.log('[+] Iniciando processo de notificação de atualização do cronograma.');
    
    const todosInscritos = await EmailSubscription.find({}, 'email');
    
    if (!todosInscritos || todosInscritos.length === 0) {
      console.log('[i] Nenhum inscrito encontrado para notificar. Processo encerrado.');
      return;
    }

    const listaDeEmails = todosInscritos.map(inscrito => ({ email: inscrito.email }));
    console.log(`[i] Encontrados ${listaDeEmails.length} e-mails para notificação.`);

    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY; // Sua chave da Brevo (Sendinblue)

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = 'O cronograma de coleta de resíduos foi atualizado!';
    sendSmtpEmail.htmlContent = `
      <html>
        <body>
          <h1>Olá! O cronograma de coleta foi atualizado.</h1>
          <p>Acesse nosso site para conferir as novas datas e não perca o dia da coleta no seu bairro.</p>
          <p>Para visualizar o novo cronograma, <a href="https://coleta-react.vercel.app/cronograma-da-coleta-de-residuos" target="_blank">clique aqui</a>.</p>
            

          <p>Atenciosamente,</p>
          <p><strong>Equipe Coleta</strong></p>
        </body>
      </html>
    `;
    // IMPORTANTE: Use seu e-mail e nome de remetente verificados na Brevo
    sendSmtpEmail.sender = { name: 'Equipe Coleta', email: 'contato@coleta.com' }; 
    sendSmtpEmail.to = listaDeEmails;

    await apiInstance.sendTransacEmail(sendSmtpEmail );
    console.log('[✓] Notificação de cronograma enviada com sucesso!');

  } catch (error) {
    console.error('[X] Erro CRÍTICO ao enviar notificação de cronograma:', error.response ? error.response.body : error.message);
  }
};


// ===========================
// BUSCAR PÁGINA POR SLUG (PUBLIC)
// ===========================
export const getPaginaBySlug = async (req, res) => {
  try {
    const slugParam = normalizeSlug(req.params.slug);
    if (!slugParam) {
      return res.status(400).json({ message: 'Slug inválido fornecido.' });
    }
    const paginas = await Pagina.aggregate([
      { $addFields: { normalizedSlug: { $toLower: { $trim: { input: '$slug' } } } } },
      { $match: { normalizedSlug: slugParam.toLowerCase() } }
    ]);
    const pagina = paginas[0];
    if (!pagina) {
      console.error(`[LOG] Página não encontrada para o slug normalizado: "${slugParam.toLowerCase()}"`);
      return res.status(404).json({ message: 'Página não encontrada' });
    }
    delete pagina.normalizedSlug;
    const dataFormatada = new Date(pagina.updatedAt).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
    const resposta = { ...pagina, ultimaAtualizacao: dataFormatada };
    res.json(resposta);
  } catch (err) {
    console.error("[ERRO] Falha no servidor ao buscar página por slug:", err);
    res.status(500).json({ message: err.message });
  }
};

// ===========================
// CRIAR PÁGINA
// ===========================
export const createPagina = async (req, res) => {
  try {
    const { slug, titulo, conteudo } = req.body;
    const midiaUrl = req.file ? req.file.path : null;
    const paginaExistente = await Pagina.findOne({ slug });
    if (paginaExistente) {
      return res.status(400).json({ message: 'Slug já existe' });
    }
    const pagina = await Pagina.create({ slug, titulo, conteudo, midiaUrl });
    res.status(201).json(pagina);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===========================
// ATUALIZAR PÁGINA (COM GATILHO CORRIGIDO)
// ===========================
export const updatePagina = async (req, res) => {
  try {
    const pagina = await Pagina.findById(req.params.id);
    if (!pagina) {
      return res.status(404).json({ message: 'Página não encontrada' });
    }

    const novaImagemEnviada = !!req.file;

    if (req.file) {
      pagina.midiaUrl = req.file.path;
    } else if (req.body.midiaUrl !== undefined) {
      pagina.midiaUrl = req.body.midiaUrl || null;
    }

    pagina.slug = req.body.slug || pagina.slug;
    pagina.titulo = req.body.titulo || pagina.titulo;
    pagina.conteudo = req.body.conteudo || pagina.conteudo;

    const paginaAtualizada = await pagina.save();

    // --- GATILHO DE NOTIFICAÇÃO ---
    if (paginaAtualizada.slug === 'cronograma-da-coleta-de-residuos' && novaImagemEnviada) {
      console.log('[!] Gatilho acionado: Cronograma atualizado com nova imagem. Disparando notificações...');
      // Chama a função de envio de forma assíncrona para não atrasar a resposta ao admin
      enviarNotificacaoDeCronograma();
    }
    // --- FIM DO GATILHO ---

    res.json(paginaAtualizada);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===========================
// LISTAR TODAS AS PÁGINAS (ADMIN)
// ===========================
export const getPaginas = async (req, res) => {
  try {
    const paginas = await Pagina.find().sort({ createdAt: -1 });
    res.json(paginas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===========================
// BUSCAR PÁGINA POR ID (ADMIN)
// ===========================
export const getPaginaById = async (req, res) => {
  try {
    const pagina = await Pagina.findById(req.params.id);
    if (!pagina) {
      return res.status(404).json({ message: 'Página não encontrada' });
    }
    res.json(pagina);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===========================
// DELETAR PÁGINA
// ===========================
export const deletePagina = async (req, res) => {
  try {
    const pagina = await Pagina.findById(req.params.id);
    if (!pagina) {
      return res.status(404).json({ message: 'Página não encontrada' });
    }
    await Pagina.deleteOne({ _id: req.params.id });
    res.json({ message: 'Página removida com sucesso' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===========================
// FUNÇÃO DE DIAGNÓSTICO (TEMPORÁRIA)
// ===========================
export const getAllSlugs = async (req, res) => {
  try {
    const paginas = await Pagina.find().select('slug titulo');
    res.json(paginas);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar slugs', error: err.message });
  }
};
