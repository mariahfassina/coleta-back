// Arquivo: config/brevo.js (Versão Segura e Final, lendo do .env)

import SibApiV3Sdk from 'sib-api-v3-sdk';

// 1. Pega a chave de API do seu arquivo .env, que foi carregado pelo server.js
const brevoApiKey = process.env.BREVO_API_KEY;

// 2. A verificação de segurança original
if (!brevoApiKey) {
  console.warn('AVISO: Chave da API do Brevo (BREVO_API_KEY) não encontrada no .env. O envio de e-mails não funcionará.');
}

// 3. Configura o cliente da API com a chave vinda do .env
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = brevoApiKey;

// 4. Exporta uma instância pronta para ser usada
export const transactionalEmailsApi = new SibApiV3Sdk.TransactionalEmailsApi();
