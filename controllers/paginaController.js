import Pagina from '../models/Pagina.js';
import SibApiV3Sdk from 'sib-api-v3-sdk'; // Dependência para enviar e-mails
import EmailSubscription from '../models/EmailSubscription.js'; // Modelo para buscar os e-mails dos inscritos


const normalizeSlug = (slug) => {
  if (!slug) return '';
  return slug
    .normalize('NFC')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .trim();
};


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
<head>
    <meta charset="UTF-8">
    <title>Cronograma de Coleta Atualizado</title>
    <style>
      body {
        font-family: 'Arial', sans-serif;
        background-color: #f5f7fa;
        color: #333333;
        margin: 0;
        padding: 0;
      }
      .container {
        width: 100%;
        max-width: 600px;
        margin: 30px auto;
        background-color: #ffffff;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        overflow: hidden;
        padding: 20px;
      }
      .header {
        text-align: center;
        padding-bottom: 20px;
      }
      .header img {
        max-width: 150px;
      }
      h1 {
        color: #2a7ae2;
        font-size: 24px;
        margin-bottom: 20px;
      }
      p {
        font-size: 16px;
        line-height: 1.6;
      }
      a.button {
        display: inline-block;
        margin: 20px 0;
        padding: 12px 25px;
        background-color: #2a7ae2;
        color: #ffffff !important;
        text-decoration: none;
        border-radius: 8px;
        font-weight: bold;
      }
      .footer {
        margin-top: 30px;
        font-size: 14px;
        color: #777777;
        text-align: center;
      }
      .footer img {
        max-width: 80px;
        margin-top: 10px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="uploads/logo-coleta-amiga.png" alt="Logo Coleta Amiga">
      </div>

      <h1>Olá!</h1>
      <p>O cronograma de coleta foi atualizado. Acesse nosso site para conferir as novas datas e não perca o dia da coleta no seu bairro.</p>
      
      <p style="text-align:center;">
        <a href="https://coletareact.vercel.app" target="_blank" class="button">Ver Cronograma</a>
      </p>

      <p>Atenciosamente,</p>
      <p><strong>Equipe Coleta Amiga</strong></p>

      <div class="footer">
        <p>© 2025 Coleta Amiga. Todos os direitos reservados.</p>
        <img src="uploads/logo-coleta-amiga.png" alt="Logo Coleta Amiga">
      </div>
    </div>
  </body>
</html>
    `;

    sendSmtpEmail.sender = { name: 'Equipe Coleta', email: '20233017592@estudantes.ifpr.edu.br' }; 
    sendSmtpEmail.to = listaDeEmails;

    await apiInstance.sendTransacEmail(sendSmtpEmail );
    console.log('[✓] Notificação de cronograma enviada com sucesso!');

  } catch (error) {
    console.error('[X] Erro CRÍTICO ao enviar notificação de cronograma:', error.response ? error.response.body : error.message);
  }
};


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


    if (paginaAtualizada.slug === 'cronograma-da-coleta-de-residuos' && novaImagemEnviada) {
      console.log('[!] Gatilho acionado: Cronograma atualizado com nova imagem. Disparando notificações...');
      enviarNotificacaoDeCronograma();
    }


    res.json(paginaAtualizada);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPaginas = async (req, res) => {
  try {
    const paginas = await Pagina.find().sort({ createdAt: -1 });
    res.json(paginas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


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

export const getAllSlugs = async (req, res) => {
  try {
    const paginas = await Pagina.find().select('slug titulo');
    res.json(paginas);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar slugs', error: err.message });
  }
};



