import Pagina from '../models/Pagina.js';
import EmailSubscription from '../models/EmailSubscription.js';
// Importamos a biblioteca que foi exportada pelo brevo.js
import SibApiV3Sdk from '../config/brevo.js';

// ========================================================
// FUNÇÕES EXISTENTES (SEM ALTERAÇÕES)
// ========================================================

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

// ========================================================
// FUNÇÃO UPDATEPAGINA (COM A LÓGICA CORRETA E COMPLETA)
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

          const defaultClient = SibApiV3Sdk.ApiClient.instance;
          const apiKey = defaultClient.authentications['api-key'];
          apiKey.apiKey = process.env.BREVO_API_KEY;

          const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
          const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
          
          sendSmtpEmail.to = recipients;
          sendSmtpEmail.subject = '📢 Cronograma da Coleta Seletiva Atualizado!';
          sendSmtpEmail.htmlContent = `
       <!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
  <title>📢 Cronograma da Coleta Seletiva Atualizado!</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      width: 100% !important;
      background-color: #f0f4f8; /* Um azul-acinzentado muito claro, cor do céu */
      font-family: 'Poppins', Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #f0f4f8;
      padding: 40px 0;
    }
    .main {
      background-color: #ffffff;
      margin: 0 auto;
      width: 100%;
      max-width: 600px;
      border-spacing: 0;
      border-radius: 24px; /* Cantos bem arredondados, mais amigável */
      overflow: hidden;
      border: 1px solid #e2e8f0;
    }
    .header {
      padding: 32px 20px;
      text-align: center;
      background-color: #ffffff;
    }
    .header img {
      width: 180px;
      max-width: 100%;
    }
    .content {
      padding: 24px 40px 40px 40px;
    }
    .icon-wrapper {
      text-align: center;
      margin-bottom: 24px;
    }
    h1 {
      font-size: 26px;
      font-weight: 700;
      color: #1e2a3a;
      margin: 0 0 16px 0;
      text-align: center;
      line-height: 1.3;
    }
    p {
      font-size: 16px;
      line-height: 1.6;
      color: #4a5568;
      margin: 0 0 20px 0;
      text-align: center;
    }
    .button-wrapper {
      text-align: center;
      padding: 10px 0;
    }
    .button {
      display: inline-block;
      background-color: #28a745; /* O verde da sua marca! */
      color: #ffffff;
      padding: 16px 36px;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 700;
      font-size: 16px;
      letter-spacing: 0.5px;
      transition: all 0.3s ease;
    }
    .button:hover {
      background-color: #218838;
      transform: translateY(-3px );
      box-shadow: 0 10px 20px rgba(40, 167, 69, 0.2);
    }
    .footer {
      background-color: #003366; /* O azul da sua marca! */
      color: #e2e8f0;
      padding: 32px 40px;
      text-align: center;
      font-size: 12px;
    }
    .footer p {
      font-size: 12px;
      color: #e2e8f0;
      margin: 0 0 12px 0;
    }
    .footer a {
      color: #ffffff;
      text-decoration: none;
      font-weight: 600;
    }
    .footer a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <center class="wrapper">
    <table class="main" role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
      <!-- CABEÇALHO COM A LOGO -->
      <tr>
        <td class="header">
          <!-- URL CORRIGIDA E COMPLETA DA SUA LOGO -->
          <a href="https://coletareact.vercel.app/" target="_blank">
            <img src="https://coletareact.vercel.app/uploads/logo-coleta-amiga.png" alt="Logo Coleta Amiga" width="180">
          </a>
        </td>
      </tr>

      <!-- CONTEÚDO PRINCIPAL -->
      <tr>
        <td class="content">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td class="icon-wrapper">
                <!-- Ícone de Caminhão de Coleta -->
                <img src="https://i.ibb.co/L6qZq3q/truck-icon.png" alt="Caminhão da Coleta" width="64">
              </td>
            </tr>
            <tr>
              <td>
                <h1>O caminhão da coleta tem novas datas para passar no seu bairro!</h1>
                <p>Olá, vizinho(a )! Para manter nossa cidade um exemplo, o cronograma da coleta seletiva foi atualizado. Fique por dentro para não perder o dia!</p>
              </td>
            </tr>
            <tr>
              <td class="button-wrapper">
                <a href="https://coletareact.vercel.app/#cronograma" target="_blank" class="button">
                  VER NOVOS DIAS E HORÁRIOS
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- RODAPÉ -->
      <tr>
        <td class="footer">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td>
                <p style="font-weight: 600; font-size: 14px;">Sua atitude faz a diferença 🌱</p>
                <p>Prefeitura de Assis Chateaubriand &bull; Projeto Coleta Amiga</p>
                <p style="font-size: 10px; opacity: 0.7; margin-top: 20px;">Você recebe este e-mail por ser um amigo(a ) do meio ambiente e ter se cadastrado para receber nossas atualizações.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </center>
</body>
</html>


          `;
          sendSmtpEmail.sender = {
            name: 'Coleta Seletiva Assis Chateaubriand',
            email: '20233017592@estudantes.ifpr.edu.br'
          };

          await apiInstance.sendTransacEmail(sendSmtpEmail );
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

// ========================================================
// FUNÇÃO DE DELETAR (SEM ALTERAÇÕES)
// ========================================================
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




