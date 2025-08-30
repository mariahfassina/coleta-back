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
    :root {
      color-scheme: light dark;
      supported-color-schemes: light dark;
    }
    body {
      margin: 0;
      padding: 0;
      width: 100% !important;
      background-color: #eef0f2;
      font-family: 'Poppins', Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #eef0f2;
      padding: 40px 0;
    }
    .main {
      background-color: #ffffff;
      margin: 0 auto;
      width: 100%;
      max-width: 600px;
      border-spacing: 0;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1 );
    }
    .header {
      background-color: #003366;
      padding: 30px 20px;
      text-align: center;
    }
    .header img {
      width: 180px;
      max-width: 100%;
    }
    .content {
      padding: 48px 40px;
    }
    h1 {
      font-size: 28px;
      font-weight: 700;
      color: #1e2a3a;
      margin: 0 0 16px 0;
      line-height: 1.2;
    }
    p {
      font-size: 16px;
      line-height: 1.7;
      color: #4a5568;
      margin: 0 0 24px 0;
    }
    .button-wrapper {
      text-align: center;
      padding: 10px 0;
    }
    .button {
      display: inline-block;
      background-color: #28a745;
      color: #ffffff;
      padding: 16px 36px;
      text-decoration: none;
      border-radius: 10px;
      font-weight: 600;
      font-size: 16px;
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      box-shadow: 0 4px 15px rgba(40, 167, 69, 0.2);
    }
    .button:hover {
      background-color: #218838;
      transform: scale(1.05) translateY(-2px);
      box-shadow: 0 10px 20px rgba(40, 167, 69, 0.3);
    }
    .highlight {
      margin-top: 32px;
      padding: 20px;
      background-color: #f7fafc;
      border-left: 4px solid #28a745;
      font-style: italic;
      color: #2d3748;
    }
    .footer {
      background-color: #1e2a3a;
      color: #a0aec0;
      padding: 40px;
      text-align: center;
      font-size: 12px;
    }
    .footer .social-icon {
      display: inline-block;
      margin: 0 10px 20px 10px;
      transition: transform 0.2s ease;
    }
    .footer .social-icon:hover {
      transform: scale(1.1);
    }
    .footer p {
      font-size: 12px;
      color: #a0aec0;
      margin: 0 0 8px 0;
    }
    .footer a {
      color: #ffffff;
      text-decoration: none;
      font-weight: 600;
    }
    .footer a:hover {
      text-decoration: underline;
    }
    @media (prefers-color-scheme: dark) {
      body, .wrapper { background-color: #1a202c !important; }
      .main { background-color: #2d3748 !important; }
      h1, .highlight { color: #edf2f7 !important; }
      p { color: #a0aec0 !important; }
      .highlight { background-color: #4a5568 !important; border-left-color: #38a169 !important; }
      .footer { background-color: #171923 !important; }
      .footer p { color: #718096 !important; }
      .footer a { color: #e2e8f0 !important; }
    }
  </style>
</head>
<body>
  <center class="wrapper">
    <table class="main" role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
      <!-- HEADER -->
      <tr>
        <td class="header">
          <img src="https://coletareact.vercel.app/logo-coleta-amiga.png" alt="Logo Coleta Amiga" width="180">
        </td>
      </tr>

      <!-- CONTEÚDO PRINCIPAL -->
      <tr>
        <td class="content">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td>
                <h1>O futuro da nossa cidade está em suas mãos. E no seu lixo.</h1>
                <p>Olá, morador(a )!</p>
                <p>Para continuarmos construindo uma Assis Chateaubriand mais verde e sustentável, o cronograma da coleta seletiva foi atualizado. Sua participação é o motor da nossa mudança.</p>
                <p>Confira as novas datas e horários para garantir que seu bairro continue sendo um exemplo de cidadania e cuidado com o meio ambiente.</p>
              </td>
            </tr>
            <tr>
              <td class="button-wrapper">
                <a href="https://coletareact.vercel.app/#cronograma" target="_blank" class="button">
                  Ver o Novo Cronograma
                </a>
              </td>
            </tr>
            <tr>
              <td>
                <div class="highlight">
                  <p style="margin:0;">"A mudança que queremos no mundo começa na separação do lixo em nossa casa."</p>
                </div>
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
              <td class="social-links">
                <a href="https://www.instagram.com/uvr_assis/" target="_blank" class="social-icon">
                  <img src="https://i.ibb.co/7jX0c7G/instagram-icon.png" alt="Instagram" width="32" border="0">
                </a>
                <a href="tel:+5544991833010" target="_blank" class="social-icon">
                  <img src="https://i.ibb.co/N2h5P2T/phone-icon.png" alt="Telefone" width="32" border="0">
                </a>
              </td>
            </tr>
            <tr>
              <td>
                <p><strong>Prefeitura Municipal de Assis Chateaubriand</strong></p>
                <p>Secretaria de Meio Ambiente – Projeto Coleta Amiga</p>
              </td>
            </tr>
            <tr>
              <td style="padding-top: 20px;">
                <p style="font-size: 10px; opacity: 0.7;">Você recebeu este e-mail porque se inscreveu para receber atualizações do cronograma.</p>
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



